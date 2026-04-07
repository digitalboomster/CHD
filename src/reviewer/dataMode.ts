import type { DataSource } from '../api/hooks'

export type HandoffDataMode =
  | 'bundle'
  | 'api_loading'
  | 'api_live'
  | 'api_mixed'
  | 'api_down'

type Sources = {
  funds: DataSource
  perf: DataSource
  ticker: DataSource
  fundsError: boolean
  perfError: boolean
}

export function deriveHandoffDataMode(
  apiConfigured: boolean,
  apiLoading: boolean,
  s: Sources,
): HandoffDataMode {
  if (!apiConfigured) return 'bundle'
  if (apiLoading) return 'api_loading'

  const allApi =
    s.funds === 'api' && s.perf === 'api' && s.ticker === 'api'
  if (allApi && !s.fundsError && !s.perfError) return 'api_live'

  const allMock =
    s.funds === 'mock' && s.perf === 'mock' && s.ticker === 'mock'
  if (allMock) return 'api_down'

  return 'api_mixed'
}
