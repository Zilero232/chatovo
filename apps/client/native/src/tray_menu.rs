use std::sync::Mutex;

use tauri::{
    menu::{CheckMenuItem, Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager,
};

const TRAY_ID: &str = "main";

const ID_STATUS: &str = "tray_status";
const ID_MUTE: &str = "tray_mute";
const ID_DEAFEN: &str = "tray_deafen";
const ID_LEAVE: &str = "tray_leave";
const ID_OPEN: &str = "tray_open";
const ID_UPDATES: &str = "tray_updates";
const ID_QUIT: &str = "tray_quit";

/// Items the frontend keeps in sync. A `Menu` cannot be queried for its
/// children, so the ones that change are held here.
struct TrayItems {
    status: MenuItem<tauri::Wry>,
    mute: CheckMenuItem<tauri::Wry>,
    deafen: CheckMenuItem<tauri::Wry>,
    leave: MenuItem<tauri::Wry>,
}

static ITEMS: Mutex<Option<TrayItems>> = Mutex::new(None);

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrayLabels {
    status: String,
    mute: String,
    deafen: String,
    leave_room: String,
    open_app: String,
    check_updates: String,
    quit: String,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrayState {
    status: String,
    is_in_room: bool,
    is_muted: bool,
    is_deafened: bool,
}

/// Builds the tray at startup so it exists even before the webview mounts.
/// Labels start in English and are replaced by `update_tray_labels` once the
/// frontend knows the locale.
pub fn init(app: &AppHandle) -> tauri::Result<()> {
    build(
        app,
        &TrayLabels {
            status: "Online".into(),
            mute: "Mute microphone".into(),
            deafen: "Deafen".into(),
            leave_room: "Leave room".into(),
            open_app: "Open Chatovo".into(),
            check_updates: "Check for updates".into(),
            quit: "Quit Chatovo".into(),
        },
    )
}

#[tauri::command]
pub async fn update_tray_labels(labels: TrayLabels) -> Result<(), String> {
    let slot = ITEMS
        .lock()
        .map_err(|_| "tray items poisoned".to_string())?;

    let Some(items) = slot.as_ref() else {
        return Ok(());
    };

    items.mute.set_text(&labels.mute).map_err(to_message)?;
    items.deafen.set_text(&labels.deafen).map_err(to_message)?;
    items
        .leave
        .set_text(&labels.leave_room)
        .map_err(to_message)?;

    Ok(())
}

#[tauri::command]
pub async fn update_tray_state(state: TrayState) -> Result<(), String> {
    let slot = ITEMS
        .lock()
        .map_err(|_| "tray items poisoned".to_string())?;

    let Some(items) = slot.as_ref() else {
        return Ok(());
    };

    items.status.set_text(&state.status).map_err(to_message)?;
    items
        .mute
        .set_enabled(state.is_in_room)
        .map_err(to_message)?;
    items.mute.set_checked(state.is_muted).map_err(to_message)?;
    items
        .deafen
        .set_enabled(state.is_in_room)
        .map_err(to_message)?;
    items
        .deafen
        .set_checked(state.is_deafened)
        .map_err(to_message)?;
    items
        .leave
        .set_enabled(state.is_in_room)
        .map_err(to_message)?;

    Ok(())
}

fn build(app: &AppHandle, labels: &TrayLabels) -> tauri::Result<()> {
    let status = MenuItem::with_id(app, ID_STATUS, &labels.status, false, None::<&str>)?;
    let mute = CheckMenuItem::with_id(app, ID_MUTE, &labels.mute, false, false, None::<&str>)?;
    let deafen =
        CheckMenuItem::with_id(app, ID_DEAFEN, &labels.deafen, false, false, None::<&str>)?;
    let leave = MenuItem::with_id(app, ID_LEAVE, &labels.leave_room, false, None::<&str>)?;
    let open = MenuItem::with_id(app, ID_OPEN, &labels.open_app, true, None::<&str>)?;
    let updates = MenuItem::with_id(app, ID_UPDATES, &labels.check_updates, true, None::<&str>)?;
    let quit = MenuItem::with_id(app, ID_QUIT, &labels.quit, true, None::<&str>)?;

    let menu = Menu::with_items(
        app,
        &[
            &status,
            &PredefinedMenuItem::separator(app)?,
            &mute,
            &deafen,
            &leave,
            &PredefinedMenuItem::separator(app)?,
            &open,
            &updates,
            &PredefinedMenuItem::separator(app)?,
            &quit,
        ],
    )?;

    if let Ok(mut slot) = ITEMS.lock() {
        *slot = Some(TrayItems {
            status,
            mute,
            deafen,
            leave,
        });
    }

    let icon = app.default_window_icon().cloned();

    let mut builder = TrayIconBuilder::with_id(TRAY_ID)
        .tooltip("Chatovo")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| {
            let action = match event.id().as_ref() {
                ID_MUTE => "toggleMute",
                ID_DEAFEN => "toggleDeafen",
                ID_LEAVE => "leaveRoom",
                ID_UPDATES => "checkUpdates",
                ID_OPEN => {
                    show_main_window(app);

                    return;
                }
                ID_QUIT => {
                    app.exit(0);

                    return;
                }
                _ => return,
            };

            if action == "checkUpdates" {
                show_main_window(app);
            }

            let _ = app.emit("tray:action", action);
        })
        .on_tray_icon_event(|tray, event| {
            let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            else {
                return;
            };

            toggle_main_window(tray.app_handle());
        });

    if let Some(icon) = icon {
        builder = builder.icon(icon);
    }

    builder.build(app)?;

    Ok(())
}

fn show_main_window(app: &AppHandle) {
    let Some(window) = app.get_webview_window("main") else {
        return;
    };

    let _ = window.unminimize();
    let _ = window.show();
    let _ = window.set_focus();
}

fn toggle_main_window(app: &AppHandle) {
    let Some(window) = app.get_webview_window("main") else {
        return;
    };

    if window.is_visible().unwrap_or(false) && window.is_focused().unwrap_or(false) {
        let _ = window.hide();

        return;
    }

    let _ = window.unminimize();
    let _ = window.show();
    let _ = window.set_focus();
}

fn to_message(error: impl std::fmt::Display) -> String {
    error.to_string()
}
