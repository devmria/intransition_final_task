interface ImportMetaEnv {
  readonly VITE_CORE_SERVER_URL: string;
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}