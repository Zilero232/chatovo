//! Executables Windows itself recognised as games — the Game Bar's
//! `GameConfigStore`, which drives Game Mode. It covers what no launcher
//! manifest does: Battle.net, Riot, EA, Xbox PC and standalone titles. Windows only.

use std::collections::HashSet;

#[cfg(windows)]
pub fn executables() -> HashSet<String> {
    use winreg::{enums::HKEY_CURRENT_USER, RegKey};

    use super::index::normalise;

    let Ok(children) =
        RegKey::predef(HKEY_CURRENT_USER).open_subkey(r"System\GameConfigStore\Children")
    else {
        return HashSet::new();
    };

    children
        .enum_keys()
        .flatten()
        .filter_map(|id| {
            let child = children.open_subkey(id).ok()?;
            let exe: String = child.get_value("MatchedExeFullPath").ok()?;

            (!exe.is_empty()).then(|| normalise(&exe))
        })
        .collect()
}

#[cfg(not(windows))]
pub fn executables() -> HashSet<String> {
    HashSet::new()
}
