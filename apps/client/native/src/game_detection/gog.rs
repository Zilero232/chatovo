//! GOG Galaxy titles, from the `GOG.com\Games` registry key the installer writes
//! for every game (`gameName` and the install `path`). Windows only.

use super::index::GameRoot;

#[cfg(windows)]
pub fn roots() -> Vec<GameRoot> {
    use std::path::Path;

    use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

    let Ok(games) =
        RegKey::predef(HKEY_LOCAL_MACHINE).open_subkey(r"SOFTWARE\WOW6432Node\GOG.com\Games")
    else {
        return Vec::new();
    };

    games
        .enum_keys()
        .flatten()
        .filter_map(|id| {
            let game = games.open_subkey(id).ok()?;
            let name: String = game.get_value("gameName").ok()?;
            let path: String = game.get_value("path").ok()?;

            GameRoot::new(Path::new(&path), &name)
        })
        .collect()
}

#[cfg(not(windows))]
pub fn roots() -> Vec<GameRoot> {
    Vec::new()
}
