import { getApiClient } from './client'
import type { FundDto, PerformancePointDto, TickerItemDto } from './types'

export class ApiRequestError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

export async function fetchFunds(): Promise<FundDto[]> {
  const client = getApiClient()
  if (!client) throw new Error('API client not configured')
  const { data, error, response } = await client.GET('/v1/funds')
  if (error) {
    const msg =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : response.statusText
    throw new ApiRequestError(msg || 'Failed to load funds', response.status)
  }
  if (!data?.funds) throw new ApiRequestError('Invalid funds payload', response.status)
  return data.funds
}

export async function fetchPerformance(): Promise<PerformancePointDto[]> {
  const client = getApiClient()
  if (!client) throw new Error('API client not configured')
  const { data, error, response } = await client.GET('/v1/market/performance', {
    params: { query: { range: '12m' } },
  })
  if (error) {
    const msg =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : response.statusText
    throw new ApiRequestError(
      msg || 'Failed to load performance',
      response.status,
    )
  }
  if (!data?.points)
    throw new ApiRequestError('Invalid performance payload', response.status)
  return data.points
}

export async function fetchTickerItems(): Promise<TickerItemDto[]> {
  const client = getApiClient()
  if (!client) throw new Error('API client not configured')
  const { data, error, response } = await client.GET('/v1/market/ticker')
  if (error) {
    const msg =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : response.statusText
    throw new ApiRequestError(msg || 'Failed to load ticker', response.status)
  }
  if (!data?.items)
    throw new ApiRequestError('Invalid ticker payload', response.status)
  return data.items
}
