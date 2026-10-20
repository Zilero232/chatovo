/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_API_URL?: string;
  readonly NEXT_PUBLIC_APP_URL?: string;
  readonly NEXT_PUBLIC_APP_VERSION?: string;
  readonly NEXT_PUBLIC_LIVEKIT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
