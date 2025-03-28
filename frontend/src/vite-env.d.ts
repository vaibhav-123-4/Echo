interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;

    readonly VITE_BACKEND_HOST: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }