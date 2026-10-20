#[cfg(desktop)]
mod game_detection;
#[cfg(desktop)]
mod tray_menu;
#[cfg(windows)]
mod webview_lockdown;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(desktop)]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            use tauri::Manager;
            use tauri_plugin_deep_link::DeepLinkExt;

            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }
            app.deep_link().handle_cli_arguments(args.into_iter());
        }));

    #[cfg(not(desktop))]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_safe_area_insets_css::init())
        .plugin(tauri_plugin_fcm::init());

    #[cfg(desktop)]
    let builder = builder.invoke_handler(tauri::generate_handler![
        tray_menu::update_tray_labels,
        tray_menu::update_tray_state,
        game_detection::detect_running_game
    ]);

    builder
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_deep_link::init())
        .setup(|_app| {
            #[cfg(desktop)]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                if let Err(err) = _app.deep_link().register_all() {
                    eprintln!("deep-link register_all failed: {err}");
                }

                if let Err(err) = tray_menu::init(&_app.handle().clone()) {
                    eprintln!("tray init failed: {err}");
                }
            }

            #[cfg(windows)]
            if !cfg!(debug_assertions) {
                webview_lockdown::disable_browser_accelerator_keys(_app);
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
