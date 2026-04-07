export const FGN_BONDS = [
  { isin: 'NGFGTN000234', label: 'FGN MAR 2035 · 14.20% 2035' },
  { isin: 'NGFGTN000198', label: 'FGN JUL 2030 · 12.98% 2030' },
  { isin: 'NGFGTN000156', label: 'FGN APR 2027 · 13.53% 2027' },
] as const

export const RFQ_COUNTERPARTIES = [
  {
    id: 'sb',
    name: 'Stanbic IBTC',
    bid: 19.81,
    ask: 19.83,
    rating: 'AA- (NG)',
    recommended: true,
  },
  {
    id: 'gt',
    name: 'GTBank Markets',
    bid: 19.79,
    ask: 19.84,
    rating: 'A+ (NG)',
    recommended: false,
  },
  {
    id: 'ax',
    name: 'Access Bank',
    bid: 19.8,
    ask: 19.85,
    rating: 'A (NG)',
    recommended: false,
  },
  {
    id: 'fb',
    name: 'FBNQuest',
    bid: 19.78,
    ask: 19.86,
    rating: 'BBB+ (NG)',
    recommended: false,
  },
  {
    id: 'ub',
    name: 'UBA Capital',
    bid: 19.77,
    ask: 19.87,
    rating: 'BBB (NG)',
    recommended: false,
  },
] as const
