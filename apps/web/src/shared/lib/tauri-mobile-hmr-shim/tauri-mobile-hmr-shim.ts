const CLIENT_DEV_PORT = process.env.PORT ?? '3000';

/**
 * Inline script for the Vite dev page: in the Tauri Android WebView (served from tauri.localhost)
 * it points Vite's HMR socket at the host machine. Null outside development.
 */
export const getTauriMobileHmrShim = (mode: string): string | null => {
  if (mode !== 'development') {
    return null;
  }

  const hmrHost = process.env.TAURI_DEV_HOST ?? '10.0.2.2';

  return `(()=>{const h=location.hostname;if(h!=="tauri.localhost")return;const t="${hmrHost}";const p="${CLIENT_DEV_PORT}";const N=WebSocket;WebSocket=function(u,pr){if(typeof u==="string"&&pr==="vite-hmr"){const r=u.replace(/^wss?:\\/\\/[^/]+/,"ws://"+t+":"+p);return new N(r,pr)}return new N(u,pr)};WebSocket.prototype=N.prototype;Object.assign(WebSocket,{CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3})})();`;
};
