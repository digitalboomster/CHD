import { useEffect, useState } from 'react'
import { tickerToStripItem } from './adapters'
import { isApiConfigured } from './config'
import { fetchFunds, fetchPerformance, fetchTickerItems } from './fetchers'
import type { FundDto, PerformancePointDto, TickerStripItem } from './types'
import { FUNDS as MOCK_FUNDS, PERFORMANCE_MONTHS, TICKER_ITEMS } from '../data/mock'

function cloneMockFunds(): FundDto[] {
  return MOCK_FUNDS.map((f) => ({ ...f })) as FundDto[]
}

function clonePerformance(): PerformancePointDto[] {
  return PERFORMANCE_MONTHS.map((p) => ({ ...p }))
}

function cloneMockTicker(): TickerStripItem[] {
  return TICKER_ITEMS.map((t) => ({ ...t }))
}

export type DataSource = 'api' | 'mock'

export function useFunds() {
  const configured = isApiConfigured()
  const [funds, setFunds] = useState<FundDto[]>(() =>
    configured ? [] : cloneMockFunds(),
  )
  const [loading, setLoading] = useState<boolean>(configured)
  const [error, setError] = useState<Error | null>(null)
  const [source, setSource] = useState<DataSource>(configured ? 'api' : 'mock')

  useEffect(() => {
    if (!configured) {
      setFunds(cloneMockFunds())
      setLoading(false)
      setError(null)
      setSource('mock')
      return
    }

    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchFunds()
        if (cancelled) return
        if (!data.length) {
          setFunds(cloneMockFunds())
          setSource('mock')
        } else {
          setFunds(data)
          setSource('api')
        }
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e : new Error(String(e)))
        setFunds(cloneMockFunds())
        setSource('mock')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [configured])

  return { funds, loading, error, source }
}

export function usePerformanceSeries() {
  const configured = isApiConfigured()
  const [points, setPoints] = useState<PerformancePointDto[]>(() =>
    configured ? [] : clonePerformance(),
  )
  const [loading, setLoading] = useState<boolean>(configured)
  const [error, setError] = useState<Error | null>(null)
  const [source, setSource] = useState<DataSource>(configured ? 'api' : 'mock')

  useEffect(() => {
    if (!configured) {
      setPoints(clonePerformance())
      setLoading(false)
      setError(null)
      setSource('mock')
      return
    }

    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPerformance()
        if (cancelled) return
        if (!data.length) {
          setPoints(clonePerformance())
          setSource('mock')
        } else {
          setPoints(data)
          setSource('api')
        }
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e : new Error(String(e)))
        setPoints(clonePerformance())
        setSource('mock')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [configured])

  return { points, loading, error, source }
}

export function useTickerStrip() {
  const configured = isApiConfigured()
  const [items, setItems] = useState<TickerStripItem[]>(() =>
    cloneMockTicker(),
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [source, setSource] = useState<DataSource>('mock')

  useEffect(() => {
    if (!configured) {
      setItems(cloneMockTicker())
      setLoading(false)
      setSource('mock')
      return
    }

    let cancelled = false

    ;(async () => {
      setLoading(true)
      try {
        const data = await fetchTickerItems()
        if (cancelled) return
        if (!data.length) {
          setItems(cloneMockTicker())
          setSource('mock')
        } else {
          setItems(data.map(tickerToStripItem))
          setSource('api')
        }
      } catch {
        if (cancelled) return
        setItems(cloneMockTicker())
        setSource('mock')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [configured])

  return { items, loading, source }
}
