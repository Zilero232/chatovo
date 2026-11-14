//! Windows only: WebView2 does its networking in `msedgewebview2.exe`, so a VPN that tunnels
//! by application (Incy, WireSock) never sees the app's traffic when the user picks
//! `chatovo.exe`. The main webview is pointed at this loopback SOCKS5 relay instead, so every
//! TCP connection — API, sockets, link previews, the YouTube player — leaves from
//! `chatovo.exe` itself. WebRTC media is UDP, ignores the proxy and still goes direct.

use std::io;
use std::net::{Ipv4Addr, TcpListener as StdTcpListener};
use std::time::Duration;

use fast_socks5::server::{run_tcp_proxy, DnsResolveHelper as _, Socks5ServerProtocol};
use fast_socks5::{ReplyError, Socks5Command, SocksError};
use tauri::{App, WebviewWindowBuilder};
use tokio::net::{TcpListener, TcpStream};

const MAIN_WINDOW: &str = "main";
const CONNECT_TIMEOUT: Duration = Duration::from_secs(10);

/// Creates the main window (`create: false` in tauri.windows.conf.json) behind the relay.
/// If the relay cannot start, the window is still created and connects directly.
pub fn create_main_window(app: &App) -> tauri::Result<()> {
    let Some(config) = app
        .config()
        .app
        .windows
        .iter()
        .find(|window| window.label == MAIN_WINDOW)
        .cloned()
    else {
        return Ok(());
    };

    let mut builder = WebviewWindowBuilder::from_config(app, &config)?;

    match start_relay() {
        Ok(port) => {
            let base_args = config
                .additional_browser_args
                .as_deref()
                .unwrap_or_default();
            let args = format!("{base_args} --proxy-server=socks5://127.0.0.1:{port}");
            builder = builder.additional_browser_args(args.trim_start());
        }
        Err(err) => eprintln!("webview proxy failed to start, connecting directly: {err}"),
    }

    builder.build()?;

    Ok(())
}

fn start_relay() -> io::Result<u16> {
    let listener = StdTcpListener::bind((Ipv4Addr::LOCALHOST, 0))?;
    listener.set_nonblocking(true)?;
    let port = listener.local_addr()?.port();

    tauri::async_runtime::spawn(async move {
        let listener = match TcpListener::from_std(listener) {
            Ok(listener) => listener,
            Err(err) => {
                eprintln!("webview proxy listener failed: {err}");
                return;
            }
        };

        loop {
            let Ok((client, _)) = listener.accept().await else {
                continue;
            };

            tauri::async_runtime::spawn(async move {
                let _ = relay(client).await;
            });
        }
    });

    Ok(port)
}

async fn relay(client: TcpStream) -> Result<(), SocksError> {
    let (protocol, command, target) = Socks5ServerProtocol::accept_no_auth(client)
        .await?
        .read_command()
        .await?
        .resolve_dns()
        .await?;

    if command != Socks5Command::TCPConnect {
        protocol
            .reply_error(&ReplyError::CommandNotSupported)
            .await?;
        return Err(ReplyError::CommandNotSupported.into());
    }

    run_tcp_proxy(protocol, &target, CONNECT_TIMEOUT, true).await?;

    Ok(())
}
