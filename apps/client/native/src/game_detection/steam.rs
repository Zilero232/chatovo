//! Steam games: every installed app's folder from the `appmanifest_*.acf` files
//! in each library. Steam executables are often generically named (`launcher.exe`,
//! `game.exe`), so the install folder is the reliable key and the manifest `name`
//! is the display name.

use super::index::GameRoot;

pub fn roots() -> Vec<GameRoot> {
    let mut roots = Vec::new();

    let Ok(steam_dir) = steamlocate::SteamDir::locate() else {
        return roots;
    };

    let Ok(libraries) = steam_dir.libraries() else {
        return roots;
    };

    for library in libraries.flatten() {
        for app in library.apps().flatten() {
            let Some(name) = app.name.as_deref() else {
                continue;
            };

            if app.install_dir.is_empty() {
                continue;
            }

            roots.extend(GameRoot::new(&library.resolve_app_dir(&app), name));
        }
    }

    roots
}
