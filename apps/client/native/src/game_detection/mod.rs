//! Reports the game the user is playing — and only games. A process counts when
//! one of the sources on this machine knows it as a game: a Steam, Epic or GOG
//! install folder, or an executable Windows itself recognised as a game. Only the
//! executable path and name are ever inspected — never window titles or command
//! lines, which can carry paths and tokens.

mod epic;
mod filter;
mod game_config_store;
mod gog;
mod index;
mod metadata;
mod steam;

use sysinfo::{
    get_current_pid, Pid, Process, ProcessRefreshKind, ProcessesToUpdate, RefreshKind, System,
    UpdateKind,
};

/// Returns the title of the game the user most recently started, or `None` when
/// nothing running is a known game. The newest process wins — a game launched a
/// minute ago is what the user is doing — and ties break on pid so the answer
/// stays stable between polls.
#[tauri::command]
pub fn detect_running_game() -> Option<String> {
    let mut system = System::new_with_specifics(RefreshKind::nothing());

    system.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing()
            .with_exe(UpdateKind::Always)
            .with_user(UpdateKind::Always),
    );

    let own_pid = get_current_pid().ok();
    let own_user = own_pid
        .and_then(|pid| system.process(pid))
        .and_then(|process| process.user_id())
        .cloned();

    let mut candidates: Vec<(&Pid, &Process)> = system
        .processes()
        .iter()
        .filter(|(pid, _)| Some(**pid) != own_pid)
        .filter(|(_, process)| is_candidate(process, own_user.as_ref()))
        .collect();

    candidates.sort_by_key(|(pid, process)| (process.run_time(), **pid));

    let games = index::current();

    candidates
        .iter()
        .find_map(|(_, process)| games.title_of(process.exe()?))
}

fn is_candidate(process: &Process, own_user: Option<&sysinfo::Uid>) -> bool {
    let Some(exe) = process.exe() else {
        return false;
    };

    if filter::is_excluded_path(exe) {
        return false;
    }

    if !filter::is_long_running(process.run_time()) {
        return false;
    }

    if let (Some(own_user), Some(user)) = (own_user, process.user_id()) {
        if user != own_user {
            return false;
        }
    }

    !filter::is_excluded_name(&process.name().to_string_lossy())
}
