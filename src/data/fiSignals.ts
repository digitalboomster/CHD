/** Tenor (years) vs yield % — mock curve data */
export const YIELD_CURVE_NOW = [
  { tenor: 0.25, y: 23.41 },
  { tenor: 1, y: 24.8 },
  { tenor: 2, y: 25.1 },
  { tenor: 3, y: 25.35 },
  { tenor: 5, y: 25.5 },
  { tenor: 7, y: 25.65 },
  { tenor: 10, y: 19.85 },
  { tenor: 15, y: 20.1 },
  { tenor: 20, y: 20.35 },
  { tenor: 30, y: 20.55 },
]

export const YIELD_CURVE_30D_AGO = YIELD_CURVE_NOW.map((p) => ({
  tenor: p.tenor,
  y: p.tenor < 3 ? p.y - 0.35 : p.tenor < 10 ? p.y - 0.22 : p.y - 0.15,
}))
