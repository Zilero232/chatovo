//! One index of where games live on this machine, gathered from every source
//! that knows a program is a game: Steam, Epic and GOG install folders, plus the
//! executables Windows itself recognised as games. A process outside it is not a
//! game, whatever its file metadata says.

use std::{
    collections::HashSet,
    path::Path,
    sync::{Arc, LazyLock, Mutex},
    time::{Duration, Instant},
};

use super::{epic, game_config_store, gog, metadata, steam};

const CACHE_TTL: Duration = Duration::from_secs(300);

/// An install folder (normalised, no trailing slash) and the title it belongs to.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct GameRoot {
    pub root: String,
    pub name: String,
    /// `root` plus a trailing slash, built once so a lookup never allocates.
    prefix: String,
}

impl GameRoot {
    /// `None` for an empty title or a folder too shallow to stand for one game
    /// (a drive root would match every program on the drive).
    pub fn new(path: &Path, name: &str) -> Option<Self> {
        let root = normalise(&path.to_string_lossy());
        let name = name.trim();
        let depth = root
            .split('/')
            .filter(|segment| !segment.is_empty())
            .count();

        if name.is_empty() || depth < 2 {
            return None;
        }

        Some(Self {
            prefix: format!("{root}/"),
            root,
            name: name.to_owned(),
        })
    }
}

#[derive(Debug, Default)]
pub struct GameIndex {
    roots: Vec<GameRoot>,
    executables: HashSet<String>,
}

impl GameIndex {
    pub fn new(roots: Vec<GameRoot>, executables: HashSet<String>) -> Self {
        Self { roots, executables }
    }

    /// The title of the game `exe` belongs to: the deepest install folder that
    /// contains it, else the executable's own name when Windows lists it as a game.
    pub fn title_of(&self, exe: &Path) -> Option<String> {
        let path = normalise(&exe.to_string_lossy());

        self.roots
            .iter()
            .filter(|game| path.starts_with(&game.prefix))
            .max_by_key(|game| game.root.len())
            .map(|game| game.name.clone())
            .or_else(|| {
                self.executables
                    .contains(&path)
                    .then(|| executable_title(exe))
                    .flatten()
            })
    }
}

/// When the index was built, and the index itself.
type CachedIndex = Option<(Instant, Arc<GameIndex>)>;

static CACHE: LazyLock<Mutex<CachedIndex>> = LazyLock::new(|| Mutex::new(None));

/// Rebuilt at most once every [`CACHE_TTL`], so a game installed mid-session is
/// picked up without rescanning every library on each poll.
pub fn current() -> Arc<GameIndex> {
    let Ok(mut cache) = CACHE.lock() else {
        return Arc::new(build());
    };

    if let Some((built_at, index)) = cache.as_ref() {
        if built_at.elapsed() < CACHE_TTL {
            return Arc::clone(index);
        }
    }

    let index = Arc::new(build());
    *cache = Some((Instant::now(), Arc::clone(&index)));

    index
}

pub fn normalise(path: &str) -> String {
    path.replace('\\', "/").trim_end_matches('/').to_lowercase()
}

fn build() -> GameIndex {
    let roots = [steam::roots(), epic::roots(), gog::roots()].concat();

    GameIndex::new(roots, game_config_store::executables())
}

fn executable_title(exe: &Path) -> Option<String> {
    metadata::display_name(exe).or_else(|| {
        exe.file_stem()
            .map(|stem| stem.to_string_lossy().into_owned())
    })
}

#[cfg(test)]
mod tests {
    use std::{collections::HashSet, path::Path};

    use super::{normalise, GameIndex, GameRoot};

    fn root(path: &str, name: &str) -> GameRoot {
        GameRoot::new(Path::new(path), name).expect("valid root")
    }

    #[test]
    fn title_of_should_match_an_exe_inside_an_install_folder_regardless_of_case_and_separators() {
        let index = GameIndex::new(
            vec![root(
                r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive",
                "Counter-Strike 2",
            )],
            HashSet::new(),
        );
        let exe = Path::new(
            r"d:\steamlibrary\STEAMAPPS\common\Counter-Strike Global Offensive\game\bin\cs2.exe",
        );

        assert_eq!(index.title_of(exe), Some("Counter-Strike 2".to_owned()));
    }

    #[test]
    fn title_of_should_match_a_unix_path() {
        let index = GameIndex::new(
            vec![root("/home/user/Games/Hades", "Hades")],
            HashSet::new(),
        );

        assert_eq!(
            index.title_of(Path::new("/home/user/Games/Hades/Hades.x86_64")),
            Some("Hades".to_owned())
        );
    }

    #[test]
    fn title_of_should_not_match_a_sibling_folder_that_shares_a_prefix() {
        let index = GameIndex::new(
            vec![root(r"D:\Games\Half-Life", "Half-Life")],
            HashSet::new(),
        );

        assert_eq!(
            index.title_of(Path::new(r"D:\Games\Half-Life 2\hl2.exe")),
            None
        );
    }

    #[test]
    fn title_of_should_prefer_the_deepest_install_folder() {
        let index = GameIndex::new(
            vec![
                root(r"D:\Games\Bundle", "Bundle"),
                root(r"D:\Games\Bundle\Episode Two", "Episode Two"),
            ],
            HashSet::new(),
        );

        assert_eq!(
            index.title_of(Path::new(r"D:\Games\Bundle\Episode Two\ep2.exe")),
            Some("Episode Two".to_owned())
        );
    }

    #[test]
    fn title_of_should_name_an_executable_windows_lists_as_a_game_after_its_file() {
        let index = GameIndex::new(
            Vec::new(),
            HashSet::from([normalise(r"C:\Games\Indie\PioneerGame.exe")]),
        );

        assert_eq!(
            index.title_of(Path::new(r"C:\Games\Indie\PioneerGame.exe")),
            Some("PioneerGame".to_owned())
        );
    }

    #[test]
    fn title_of_should_ignore_a_program_no_source_knows_as_a_game() {
        let index = GameIndex::new(vec![root(r"D:\Games\Hades", "Hades")], HashSet::new());

        assert_eq!(
            index.title_of(Path::new(
                r"C:\Program Files\Blender Foundation\Blender\blender.exe"
            )),
            None
        );
    }

    #[test]
    fn new_should_reject_a_drive_root_that_would_match_every_program() {
        assert_eq!(GameRoot::new(Path::new(r"D:\"), "Everything"), None);
        assert_eq!(GameRoot::new(Path::new("/"), "Everything"), None);
    }

    #[test]
    fn new_should_reject_an_empty_title() {
        assert_eq!(GameRoot::new(Path::new(r"D:\Games\Hades"), "  "), None);
    }
}
