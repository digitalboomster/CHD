export const VAR_KPIS = {
  var95: '₦184.2M',
  cvar: '₦221.5M',
  dv01: '₦412K',
} as const

export const VAR_ATTRIBUTION = [
  { factor: 'Duration', pct: 42 },
  { factor: 'Credit spread', pct: 28 },
  { factor: 'FX', pct: 18 },
  { factor: 'Liquidity', pct: 12 },
] as const

export const VAR_POSITIONS = [
  { bond: 'FGN MAR 2035', contrib: '₦28.4M' },
  { bond: 'FGN APR 2032', contrib: '₦22.1M' },
  { bond: 'FGN JUL 2029', contrib: '₦18.6M' },
  { bond: 'NTB 364d', contrib: '₦9.2M' },
] as const

export const VAR_HISTORY = [
  { d: 'Jan', v: 162 },
  { d: 'Feb', v: 171 },
  { d: 'Mar', v: 168 },
  { d: 'Apr', v: 175 },
  { d: 'May', v: 181 },
  { d: 'Jun', v: 184 },
] as const
