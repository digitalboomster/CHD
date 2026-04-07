import type { components } from './schema'

export type FundDto = components['schemas']['Fund']
export type PerformancePointDto = components['schemas']['PerformancePoint']
export type TickerItemDto = components['schemas']['TickerItem']
export type TickerDirection = components['schemas']['TickerDirection']

/** Ticker row as consumed by `TickerTape` (legacy mock shape). */
export type TickerStripItem = {
  label: string
  value: string
  chg: string
  up: boolean | null
}
