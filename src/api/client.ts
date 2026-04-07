import createClient from 'openapi-fetch'
import type { paths } from './schema'
import { getApiBaseUrl } from './config'

function authHeaders(): HeadersInit {
  const token = import.meta.env.VITE_API_TOKEN?.trim()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export function createApiClient() {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) return null
  return createClient<paths>({ baseUrl, headers: authHeaders() })
}

let singleton: ReturnType<typeof createClient<paths>> | null | undefined

/** Shared client; `null` when `VITE_API_BASE_URL` is not set. */
export function getApiClient() {
  if (singleton === undefined) {
    singleton = createApiClient()
  }
  return singleton
}
