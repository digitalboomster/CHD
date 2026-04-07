import type { TickerItemDto, TickerStripItem } from './types'

export function tickerToStripItem(row: TickerItemDto): TickerStripItem {
  const up: boolean | null =
    row.direction === 'up' ? true : row.direction === 'down' ? false : null
  return {
    label: row.label,
    value: row.value,
    chg: row.changeText,
    up,
  }
}
