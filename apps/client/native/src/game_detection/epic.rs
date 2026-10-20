//! Epic Games Store titles, from the launcher's per-install `*.item` manifests.
//! Only entries in the `games` category count: the same folder also lists the
//! Unreal Engine and other tools installed through the launcher.

use std::path::{Path, PathBuf};

use serde::Deserialize;

use super::index::GameRoot;

#[derive(Deserialize)]
#[serde(rename_all = "PascalCase")]
struct Manifest {
    display_name: Option<String>,
    install_location: Option<String>,
    #[serde(default)]
    app_categories: Vec<String>,
}

pub fn roots() -> Vec<GameRoot> {
    let Some(directory) = manifests_dir() else {
        return Vec::new();
    };

    let Ok(entries) = std::fs::read_dir(directory) else {
        return Vec::new();
    };

    entries
        .flatten()
        .map(|entry| entry.path())
        .filter(|path| {
            path.extension()
                .is_some_and(|extension| extension == "item")
        })
        .filter_map(|path| std::fs::read_to_string(path).ok())
        .filter_map(|text| parse_manifest(&text))
        .collect()
}

pub fn parse_manifest(text: &str) -> Option<GameRoot> {
    let manifest: Manifest = serde_json::from_str(text).ok()?;

    if !manifest
        .app_categories
        .iter()
        .any(|category| category == "games")
    {
        return None;
    }

    GameRoot::new(
        Path::new(&manifest.install_location?),
        &manifest.display_name?,
    )
}

#[cfg(windows)]
fn manifests_dir() -> Option<PathBuf> {
    let program_data = std::env::var_os("ProgramData")?;

    Some(PathBuf::from(program_data).join(r"Epic\EpicGamesLauncher\Data\Manifests"))
}

#[cfg(target_os = "macos")]
fn manifests_dir() -> Option<PathBuf> {
    let home = std::env::var_os("HOME")?;

    Some(
        PathBuf::from(home)
            .join("Library/Application Support/Epic/EpicGamesLauncher/Data/Manifests"),
    )
}

#[cfg(not(any(windows, target_os = "macos")))]
fn manifests_dir() -> Option<PathBuf> {
    None
}

#[cfg(test)]
mod tests {
    use super::parse_manifest;

    #[test]
    fn parse_manifest_should_read_a_game_install() {
        let root = parse_manifest(
            r#"{
                "DisplayName": "Hades",
                "InstallLocation": "D:\\Epic Games\\Hades",
                "AppCategories": ["public", "games", "applications"]
            }"#,
        )
        .expect("a game manifest");

        assert_eq!(root.name, "Hades");
        assert_eq!(root.root, "d:/epic games/hades");
    }

    #[test]
    fn parse_manifest_should_skip_an_engine_or_tool_install() {
        let manifest = r#"{
            "DisplayName": "Unreal Engine 5.4",
            "InstallLocation": "C:\\Program Files\\Epic Games\\UE_5.4",
            "AppCategories": ["engines"]
        }"#;

        assert_eq!(parse_manifest(manifest), None);
    }

    #[test]
    fn parse_manifest_should_skip_a_manifest_without_a_location() {
        let manifest = r#"{ "DisplayName": "Hades", "AppCategories": ["games"] }"#;

        assert_eq!(parse_manifest(manifest), None);
    }

    #[test]
    fn parse_manifest_should_ignore_malformed_json() {
        assert_eq!(parse_manifest("{ not json"), None);
    }
}
