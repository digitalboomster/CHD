import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Panel } from '../components/Panel'
import { YIELD_CURVE_30D_AGO, YIELD_CURVE_NOW } from '../data/fiSignals'
import styles from './FixedIncomeSignalsPage.module.css'

function mergeCurves() {
  return YIELD_CURVE_NOW.map((p, i) => ({
    tenor: p.tenor,
    now: p.y,
    ago: YIELD_CURVE_30D_AGO[i]?.y ?? p.y,
  }))
}

export function FixedIncomeSignalsPage() {
  const [wam, setWam] = useState(84)
  const [minYield, setMinYield] = useState(22)
  const [creditFloor, setCreditFloor] = useState(65)
  const data = useMemo(() => mergeCurves(), [])

  return (
    <>
      <h1 className={styles.pageTitle}>Fixed income signals</h1>
      <p className={styles.pageSub}>
        CHD Nigeria Bond &amp; Money Market — FGN curve shape, WAM / duration
        levers, and mandate-aware rebalance hints (prototype).
      </p>

      <div className={styles.grid}>
        <Panel
          title="FGN yield curve"
          subtitle="Spot yields vs 30 trading days ago (illustrative)"
        >
          <div className={styles.legendRow}>
            <span className={styles.legendItem}>
              <span className={styles.swatch} style={{ background: '#c9a84c' }} />
              Now
            </span>
            <span className={styles.legendItem}>
              <span className={styles.swatch} style={{ background: '#8b949e' }} />
              30d ago
            </span>
          </div>
          <div className={styles.chartBox} style={{ minHeight: 320 }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data}>
                <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                <XAxis
                  dataKey="tenor"
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                  tickFormatter={(v) => `${v}y`}
                  label={{
                    value: 'Tenor (years)',
                    position: 'insideBottom',
                    offset: -4,
                    fill: '#6e7681',
                    fontSize: 11,
                  }}
                />
                <YAxis
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ display: 'none' }} />
                <Line
                  type="monotone"
                  dataKey="now"
                  name="Now"
                  stroke="#c9a84c"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ago"
                  name="30d ago"
                  stroke="#8b949e"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className={styles.side}>
          <Panel title="WAM &amp; quality optimizer" subtitle="MMF / bond sleeves">
            <div className={styles.field}>
              <label className={styles.label} htmlFor="wam">
                Target WAM (days)
              </label>
              <div className={styles.sliderRow}>
                <input
                  id="wam"
                  type="range"
                  min={30}
                  max={180}
                  value={wam}
                  onChange={(e) => setWam(Number(e.target.value))}
                />
                <span className={styles.valueMono}>{wam}d</span>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="yield">
                Minimum yield threshold (%)
              </label>
              <div className={styles.sliderRow}>
                <input
                  id="yield"
                  type="range"
                  min={18}
                  max={26}
                  step={0.25}
                  value={minYield}
                  onChange={(e) => setMinYield(Number(e.target.value))}
                />
                <span className={styles.valueMono}>{minYield.toFixed(2)}%</span>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="credit">
                Credit quality floor (internal score)
              </label>
              <div className={styles.sliderRow}>
                <input
                  id="credit"
                  type="range"
                  min={50}
                  max={95}
                  value={creditFloor}
                  onChange={(e) => setCreditFloor(Number(e.target.value))}
                />
                <span className={styles.valueMono}>{creditFloor}</span>
              </div>
            </div>
            <div className={styles.ai}>
              <strong>Suggestion (illustrative):</strong> extend WAM toward{' '}
              {Math.min(wam + 6, 90)}d — estimated pickup{' '}
              <span className="mono">+8–14 bps</span> vs current book at{' '}
              {minYield.toFixed(2)}% floor, within typical MMF ceiling. Confirm
              against live NTB stop-outs and liquidity ladder.
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.btn}>
                Execute rebalance…
              </button>
              <button type="button" className={styles.btnGhost}>
                Save scenario
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
