//! A safety net in front of the game index: system processes, helpers and
//! always-on tools are dropped before a process is looked up at all — Wallpaper
//! Engine, for one, is installed through Steam but is not something being played.

use std::path::Path;

const MIN_RUN_TIME_SECONDS: u64 = 30;

/// Process names (lowercase, extension stripped) that are never worth showing.
const EXCLUDED_NAMES: &[&str] = &[
    "chatovo",
    "chatovo-desktop",
    "explorer",
    "finder",
    "dwm",
    "sihost",
    "taskhostw",
    "runtimebroker",
    "searchhost",
    "searchindexer",
    "startmenuexperiencehost",
    "shellexperiencehost",
    "applicationframehost",
    "textinputhost",
    "ctfmon",
    "conhost",
    "csrss",
    "wininit",
    "winlogon",
    "services",
    "lsass",
    "svchost",
    "smss",
    "fontdrvhost",
    "audiodg",
    "spoolsv",
    "msmpeng",
    "nissrv",
    "securityhealthservice",
    "securityhealthsystray",
    "systemsettings",
    "wmiprvse",
    "backgroundtaskhost",
    "chrome",
    "msedge",
    "msedgewebview2",
    "firefox",
    "brave",
    "opera",
    "vivaldi",
    "safari",
    "yandex",
    "browser",
    "steamwebhelper",
    "node",
    "bun",
    "deno",
    "python",
    "python3",
    "pythonw",
    "ruby",
    "perl",
    "java",
    "javaw",
    "cargo",
    "rustc",
    "cmd",
    "powershell",
    "pwsh",
    "bash",
    "sh",
    "zsh",
    "wsl",
    "wslhost",
    "wslrelay",
    "wslservice",
    "msrdc",
    "openconsole",
    "windowsterminal",
    "git",
    "ssh",
    "docker",
    "dockerd",
    "com.docker.backend",
    "gnome-shell",
    "plasmashell",
    "xdg-desktop-portal",
    "systemd",
    "pipewire",
    "pulseaudio",
    "wallpaper32",
    "wallpaper64",
    "wallpaperservice32",
    "wallpaperservice64",
    "lively",
    "livelywallpaper",
    "icue",
    "logioptionsplus",
    "lghub",
    "razer synapse",
    "razersynapse",
    "openrgb",
    "signalrgb",
    "msiafterburner",
    "rivatuner",
    "rtss",
    "nvidia app",
    "nvcontainer",
    "geforce experience",
    "steam",
    "epicgameslauncher",
    "battle.net",
    "galaxyclient",
    "riotclientservices",
    "eadesktop",
    "ubisoftconnect",
    "upc",
];

/// Substrings that mark a process as a helper of another app rather than an
/// app a user would recognise.
const EXCLUDED_FRAGMENTS: &[&str] = &[
    "-helper",
    "_helper",
    " helper",
    "crashpad",
    "crashhandler",
    "crashreporter",
    "updater",
    "update",
    "installer",
    "setup",
    "watchdog",
    "daemon",
    "service",
    "agent",
    "launcher",
    "bootstrapper",
    "webview",
    "renderer",
    "subprocess",
    "gpuprocess",
    "amdrs",
    "radeonsoftware",
    "nvcontainer",
    "nvidia",
    "igfx",
    "auep",
    "presentmon",
    "cncmd",
    "conpty",
];

/// Directory prefixes (normalised, lowercase) whose executables belong to the
/// OS or to sandboxed store packages.
const EXCLUDED_PATH_FRAGMENTS: &[&str] = &[
    "/windows/system32/",
    "/windows/syswow64/",
    "/windows/systemapps/",
    "/windows/winsxs/",
    "/windows/servicing/",
    "/windows/immersivecontrolpanel/",
    "/program files/windowsapps/",
    "/program files (x86)/windowsapps/",
    "/system/library/",
    "/usr/libexec/",
    "/usr/lib/",
    "/usr/sbin/",
    "/sbin/",
    "/node_modules/",
    "/.cargo/",
    "/.rustup/",
    "/.bun/",
    "/.nvm/",
    "/appdata/local/nvm/",
    "/program files/wsl/",
    "/program files/amd/",
    "/program files (x86)/amd/",
    "/program files/nvidia corporation/",
];

pub fn is_excluded_path(path: &Path) -> bool {
    let normalised = path.to_string_lossy().replace('\\', "/").to_lowercase();

    if normalised.starts_with("/windows/") || normalised.starts_with("c:/windows/") {
        return true;
    }

    EXCLUDED_PATH_FRAGMENTS
        .iter()
        .any(|fragment| normalised.contains(fragment))
}

pub fn is_excluded_name(name: &str) -> bool {
    let stem = name
        .to_lowercase()
        .trim_end_matches(".exe")
        .trim_end_matches(".app")
        .to_owned();

    if stem.is_empty() {
        return true;
    }

    EXCLUDED_NAMES.contains(&stem.as_str())
        || EXCLUDED_FRAGMENTS
            .iter()
            .any(|fragment| stem.contains(fragment))
}

pub fn is_long_running(run_time_seconds: u64) -> bool {
    run_time_seconds >= MIN_RUN_TIME_SECONDS
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use super::{is_excluded_name, is_excluded_path, is_long_running};

    #[test]
    fn is_excluded_path_should_exclude_the_windows_directory() {
        assert!(is_excluded_path(Path::new(
            r"C:\Windows\System32\svchost.exe"
        )));
        assert!(is_excluded_path(Path::new(r"C:\Windows\explorer.exe")));
    }

    #[test]
    fn is_excluded_path_should_exclude_store_packages() {
        assert!(is_excluded_path(Path::new(
            r"C:\Program Files\WindowsApps\Microsoft.Whatever\app.exe"
        )));
    }

    #[test]
    fn is_excluded_path_should_exclude_unix_system_directories() {
        assert!(is_excluded_path(Path::new("/usr/lib/gnome-shell")));
        assert!(is_excluded_path(Path::new(
            "/System/Library/CoreServices/Finder.app/Contents/MacOS/Finder"
        )));
    }

    #[test]
    fn is_excluded_path_should_allow_a_normal_install_directory() {
        assert!(!is_excluded_path(Path::new(
            r"C:\Program Files\Blender Foundation\Blender 4.2\blender.exe"
        )));
        assert!(!is_excluded_path(Path::new(
            r"D:\SteamLibrary\steamapps\common\Factorio\bin\x64\factorio.exe"
        )));
    }

    #[test]
    fn is_excluded_name_should_exclude_infrastructure() {
        for name in ["explorer.exe", "MsMpEng.exe", "chrome.exe", "svchost.exe"] {
            assert!(is_excluded_name(name), "{name} should be excluded");
        }
    }

    #[test]
    fn is_excluded_name_should_exclude_the_app_itself() {
        assert!(is_excluded_name("chatovo.exe"));
        assert!(is_excluded_name("Chatovo"));
    }

    #[test]
    fn is_excluded_name_should_exclude_helper_and_updater_processes() {
        for name in [
            "Discord Helper.exe",
            "electron-helper",
            "chrome_crashpad_handler.exe",
            "GoogleUpdater.exe",
            "steamwebhelper.exe",
        ] {
            assert!(is_excluded_name(name), "{name} should be excluded");
        }
    }

    #[test]
    fn is_excluded_name_should_exclude_runtimes_shells_and_dev_tooling() {
        for name in [
            "node.exe",
            "bun.exe",
            "python.exe",
            "java.exe",
            "cmd.exe",
            "pwsh.exe",
            "wsl.exe",
            "wslhost.exe",
            "OpenConsole.exe",
            "com.docker.backend.exe",
        ] {
            assert!(is_excluded_name(name), "{name} should be excluded");
        }
    }

    #[test]
    fn is_excluded_name_should_exclude_gpu_driver_tooling() {
        for name in [
            "RadeonSoftware.exe",
            "AMDRSSrcExt.exe",
            "AUEPMaster.exe",
            "PresentMon-x64.exe",
            "NVIDIA Share.exe",
        ] {
            assert!(is_excluded_name(name), "{name} should be excluded");
        }
    }

    #[test]
    fn is_excluded_path_should_exclude_toolchain_and_driver_directories() {
        for path in [
            r"C:\Users\me\.cargo\bin\cargo.exe",
            r"D:\Project\node_modules\.bin\tauri.exe",
            r"C:\Program Files\WSL\wsl.exe",
            r"C:\Program Files\AMD\CNext\CNext\cncmd.exe",
        ] {
            assert!(
                is_excluded_path(Path::new(path)),
                "{path} should be excluded"
            );
        }
    }

    #[test]
    fn is_excluded_name_should_exclude_an_empty_name() {
        assert!(is_excluded_name(""));
        assert!(is_excluded_name(".exe"));
    }

    #[test]
    fn is_excluded_name_should_allow_real_applications() {
        for name in ["blender.exe", "cs2.exe", "factorio", "obs64.exe"] {
            assert!(!is_excluded_name(name), "{name} should be allowed");
        }
    }

    #[test]
    fn is_excluded_name_should_exclude_always_on_background_tools() {
        for name in [
            "wallpaper64.exe",
            "wallpaperservice64.exe",
            "lively.exe",
            "icue.exe",
            "lghub.exe",
            "openrgb.exe",
            "rtss.exe",
            "nvcontainer.exe",
        ] {
            assert!(is_excluded_name(name), "{name} should be excluded");
        }
    }

    #[test]
    fn is_excluded_name_should_exclude_game_launchers_rather_than_games() {
        for name in [
            "steam.exe",
            "epicgameslauncher.exe",
            "battle.net.exe",
            "galaxyclient.exe",
            "eadesktop.exe",
        ] {
            assert!(is_excluded_name(name), "{name} should be excluded");
        }

        assert!(!is_excluded_name("eldenring.exe"));
    }

    #[test]
    fn is_long_running_should_reject_transient_processes() {
        assert!(!is_long_running(0));
        assert!(!is_long_running(29));
        assert!(is_long_running(30));
        assert!(is_long_running(3600));
    }
}
