/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // URL do backend
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
