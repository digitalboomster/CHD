export const STRESS_SCENARIOS = [
  { id: 'ngn30', label: 'NGN −30%', short: 'FX 30%' },
  { id: 'brent50', label: 'Brent → $50', short: 'Oil' },
  { id: 'cbn500', label: 'CBN +500 bps', short: 'Rates' },
  { id: 'sovereign', label: 'Sovereign downgrade', short: 'Sov.' },
  { id: 'ebcont', label: 'Eurobond contagion', short: 'EB' },
] as const

/** Fund rows × scenario columns — values are P&amp;L impact % (negative = loss) */
export const STRESS_FUND_ROWS = [
  { label: 'CHD MMF' },
  { label: 'Paramount Equity' },
  { label: 'Nigeria Bond' },
  { label: 'Nigeria Dollar Income' },
  { label: 'NIDF' },
  { label: "Women's Balanced" },
  { label: 'Nigeria REIT' },
] as const

export const STRESS_MATRIX: number[][] = [
  [-0.8, -0.2, -1.2, -0.4, -0.3],
  [-12.4, -8.1, -6.2, -9.5, -11.2],
  [-5.2, -3.1, -8.4, -12.1, -7.8],
  [-18.2, -14.5, -4.2, -22.0, -25.1],
  [-2.1, -1.8, -3.5, -4.2, -3.9],
  [-7.5, -5.2, -5.8, -7.1, -8.0],
  [-9.2, -4.5, -6.0, -8.8, -7.2],
]

export const WATERFALL_FACTORS = [
  { name: 'Rate', value: -2.8 },
  { name: 'FX', value: -4.1 },
  { name: 'Credit', value: -1.9 },
  { name: 'Liquidity', value: -0.6 },
  { name: 'Other', value: -0.4 },
] as const
