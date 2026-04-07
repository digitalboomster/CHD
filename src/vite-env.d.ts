/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_TOKEN?: string
  /** Dev-only: proxy target when using `VITE_API_BASE_URL=/api` */
  readonly VITE_DEV_API_PROXY?: string
  /** e.g. https://xxxx.supabase.co */
  readonly VITE_SUPABASE_URL?: string
  /** Dashboard “publishable” or legacy anon key — never service_role */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  /** Alias for publishable key */
  readonly VITE_SUPABASE_ANON_KEY?: string
}
