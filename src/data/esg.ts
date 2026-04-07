export const ESG_KPIS = [
  { label: 'SDG alignment', value: '8.3', suffix: '/10' },
  { label: 'Carbon intensity', value: '42', suffix: ' tCO₂e/₦M' },
  { label: 'Gender lens', value: '34', suffix: '% women-led' },
  { label: 'SROI', value: '2.8', suffix: '₦ per ₦1' },
] as const

export const SDG_TILES = [
  { id: 7, label: 'Energy', amt: '₦12.4B' },
  { id: 8, label: 'Work', amt: '₦8.1B' },
  { id: 9, label: 'Industry', amt: '₦21.0B' },
  { id: 11, label: 'Cities', amt: '₦15.2B' },
  { id: 13, label: 'Climate', amt: '₦9.8B' },
] as const

export const NIDF_IMPACT_ROWS = [
  { project: 'Solar IPP — North', sector: 'Power', cat: 'Renewables', ben: '2.1M', co2: '180k t' },
  { project: 'Gas pipeline phase II', sector: 'Gas', cat: 'Transition', ben: '—', co2: '95k t' },
  { project: 'Toll road SPV', sector: 'Transport', cat: 'Mobility', ben: '840k', co2: '22k t' },
] as const
