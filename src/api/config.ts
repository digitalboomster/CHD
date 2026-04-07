/**
 * API base URL — no trailing slash.
 * Examples:
 *   - `http://localhost:8080` (backend root serves `/v1/...`)
 *   - `/api` (same-origin; use Vite proxy to your server)
 * Leave unset or empty to use bundled mock data only.
 */
export function getApiBaseUrl(): string | null {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (raw === undefined || raw === null) return null
  const t = String(raw).trim()
  if (t === '') return null
  return t.replace(/\/+$/, '')
}

export function isApiConfigured(): boolean {
  return getApiBaseUrl() !== null
}
