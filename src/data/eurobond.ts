export type EurobondSignal = 'buy' | 'hold' | 'sell'

export const EUROBOND_SCATTER = [
  { name: 'NG 2032', duration: 6.2, spread: 418, liq: 88, signal: 'buy' as EurobondSignal },
  { name: 'NG 2031', duration: 5.1, spread: 395, liq: 92, signal: 'buy' as EurobondSignal },
  { name: 'NG 2029', duration: 3.4, spread: 362, liq: 75, signal: 'hold' as EurobondSignal },
  { name: 'NG 2027', duration: 1.8, spread: 310, liq: 62, signal: 'hold' as EurobondSignal },
  { name: 'NG 2049', duration: 22.1, spread: 510, liq: 45, signal: 'sell' as EurobondSignal },
  { name: 'NG 2042', duration: 15.6, spread: 485, liq: 52, signal: 'hold' as EurobondSignal },
  { name: 'NG 2035', duration: 8.9, spread: 440, liq: 70, signal: 'buy' as EurobondSignal },
] as const

export const SIGNAL_COLOR: Record<EurobondSignal, string> = {
  buy: '#3fb950',
  hold: '#8b949e',
  sell: '#f85149',
}
