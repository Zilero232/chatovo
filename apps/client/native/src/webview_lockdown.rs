//! Release builds on Windows only: WebView2 ships browser shortcuts an app should not
//! have — F5/Ctrl+R reload, Ctrl+P print, Ctrl+F find, F12/Ctrl+Shift+I devtools. Editing
//! keys (copy, paste, undo) are not browser accelerators and keep working. The right-click
//! menu is handled on the client, so text fields keep their native cut/copy/paste.

use tauri::{App, Manager};
use webview2_com::Microsoft::Web::WebView2::Win32::ICoreWebView2Settings3;
use windows_core::Interface;

/// Turns off the browser accelerator keys of the main window's webview.
pub fn disable_browser_accelerator_keys(app: &App) {
    let Some(window) = app.get_webview_window("main") else {
        return;
    };

    let result = window.with_webview(|webview| unsafe {
        let Ok(core) = webview.controller().CoreWebView2() else {
            return;
        };
        let Ok(settings) = core.Settings() else {
            return;
        };

        if let Ok(settings) = settings.cast::<ICoreWebView2Settings3>() {
            if let Err(err) = settings.SetAreBrowserAcceleratorKeysEnabled(false) {
                eprintln!("disabling browser accelerator keys failed: {err}");
            }
        }
    });

    if let Err(err) = result {
        eprintln!("webview lockdown failed: {err}");
    }
}
