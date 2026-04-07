export const MACRO_TABS = [
  { id: 'monetary', label: 'Monetary' },
  { id: 'fiscal', label: 'Fiscal' },
  { id: 'fx', label: 'FX' },
  { id: 'commodities', label: 'Commodities' },
] as const

export type MacroTabId = (typeof MACRO_TABS)[number]['id']

export const MPR_HISTORY = [
  { m: 'Jul 24', v: 26.75 },
  { m: 'Sep 24', v: 27.25 },
  { m: 'Nov 24', v: 27.5 },
  { m: 'Jan 26', v: 27.5 },
]

export const FISCAL_DATA = [
  { m: 'Q1 25', oil: 92, nonOil: 48 },
  { m: 'Q2 25', oil: 88, nonOil: 51 },
  { m: 'Q3 25', oil: 85, nonOil: 53 },
  { m: 'Q4 25', oil: 83, nonOil: 55 },
]

export const FX_DATA = [
  { m: 'W1', official: 1570, parallel: 1680 },
  { m: 'W2', official: 1578, parallel: 1695 },
  { m: 'W3', official: 1580, parallel: 1705 },
  { m: 'W4', official: 1583, parallel: 1712 },
]

export const COMMODITY_DATA = [
  { d: 'Mon', brent: 76.2, bonny: 74.8 },
  { d: 'Tue', brent: 75.4, bonny: 73.9 },
  { d: 'Wed', brent: 74.9, bonny: 73.2 },
  { d: 'Thu', brent: 74.2, bonny: 72.8 },
  { d: 'Fri', brent: 74.2, bonny: 72.5 },
]

export const MACRO_BRIEFING = [
  'MPR on hold at 27.50% — market pricing limited easing until CPI decelerates.',
  'Official / parallel FX spread remains wide; hard-currency books need hedge discipline.',
  'Oil prints softer week-on-week; watch 2026 budget benchmark vs spot for fiscal gap risk.',
  'NTB stop-out rates stable — supportive for MMF positioning inside WAM limits.',
  'Sovereign curve bull-flattening muted; favour quality and liquidity in bond sleeves.',
] as const
