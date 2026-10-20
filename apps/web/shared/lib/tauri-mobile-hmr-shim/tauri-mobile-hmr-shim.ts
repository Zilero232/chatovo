const CLIENT_DEV_PORT = process.env.PORT ?? '3000';

export const getTauriMobileHmrShim = (): string | null => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const hmrHost = process.env.TAURI_DEV_HOST ?? '10.0.2.2';

  return `(()=>{const h=location.hostname;if(h!=="tauri.localhost")return;const t="${hmrHost}";const p="${CLIENT_DEV_PORT}";const N=WebSocket;WebSocket=function(u,pr){if(typeof u==="string"&&u.includes("/_next/webpack-hmr")){const r=u.replace(/^wss?:\\/\\/[^/]+/,"ws://"+t+":"+p);return new N(r,pr)}return new N(u,pr)}})();`;
};
