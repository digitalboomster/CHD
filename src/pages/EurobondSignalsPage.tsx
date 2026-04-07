import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { Panel } from '../components/Panel'
import { EUROBOND_SCATTER, SIGNAL_COLOR } from '../data/eurobond'
import styles from './ReportPages.module.css'

const data = EUROBOND_SCATTER.map((d) => ({ ...d }))

export function EurobondSignalsPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>Eurobond &amp; hard currency</h1>
      <p className={styles.pageSub}>
        Nigeria Dollar Income — duration vs spread vs liquidity; colour = signal
        (mock).
      </p>
      <div className={styles.twoCol}>
        <Panel title="Universe scatter" subtitle="Spread over UST · years duration">
          <div className={styles.legendInline}>
            <span>
              <i style={{ background: SIGNAL_COLOR.buy }} /> Buy
            </span>
            <span>
              <i style={{ background: SIGNAL_COLOR.hold }} /> Hold
            </span>
            <span>
              <i style={{ background: SIGNAL_COLOR.sell }} /> Sell
            </span>
          </div>
          <div className={styles.chartTall} style={{ minHeight: 380 }}>
            <ResponsiveContainer width="100%" height={380}>
              <ScatterChart margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="duration"
                  name="Duration"
                  unit="y"
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="spread"
                  name="Spread"
                  unit=" bps"
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="liq" range={[120, 500]} name="Liq" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    fontSize: 12,
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}
                />
                <Scatter name="Bonds" data={data}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={SIGNAL_COLOR[data[i].signal]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <div className={styles.stack}>
          <Panel title="Fund metrics" subtitle="Live inputs (illustrative)">
            <dl className={styles.kv}>
              <dt>FX exposure</dt>
              <dd>USD 42% · EUR 8%</dd>
              <dt>JPM EMBI Nigeria</dt>
              <dd>+385 bps vs mid</dd>
              <dt>NGN/USD</dt>
              <dd>1,583</dd>
            </dl>
          </Panel>
          <Panel title="AI trade note" subtitle="Spread + hedge cost (mock)">
            <p className={styles.prose}>
              <strong>Lean overweight</strong> NG 2032 vs 2029 belly on carry —
              hedge 3M NDF roll estimated <span className="mono">+18 bps</span>{' '}
              annualised. Size clips at <span className="mono">$12m</span> until
              EM liquidity window widens.
            </p>
            <button type="button" className={styles.btnGold}>
              RFQ selected bond…
            </button>
          </Panel>
        </div>
      </div>
    </>
  )
}
