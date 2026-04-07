import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Panel } from '../components/Panel'
import { BACKTEST_SERIES } from '../data/backtest'
import styles from './ReportPages.module.css'

const FACTORS = ['Momentum', 'Value', 'Quality', 'Low-vol', 'Oil β'] as const

export function FactorBacktestPage() {
  const [weights, setWeights] = useState<Record<string, number>>({
    Momentum: 28,
    Value: 22,
    Quality: 20,
    'Low-vol': 18,
    'Oil β': 12,
  })

  const sum = useMemo(
    () => FACTORS.reduce((s, f) => s + (weights[f] ?? 0), 0),
    [weights],
  )

  return (
    <>
      <h1 className={styles.pageTitle}>Factor backtesting</h1>
      <p className={styles.pageSub}>
        NGX equity sleeve — configure weights (target 100%), view mock 2016–2025
        indexed curve vs NGX ASI.
      </p>
      <div className={styles.grid2}>
        <Panel title="Factor configuration" subtitle="Rebalance: monthly (mock)">
          <div className={styles.factorSliders}>
            {FACTORS.map((f) => (
              <label key={f} style={{ display: 'block', marginBottom: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <span>{f}</span>
                  <span className={styles.mono}>{weights[f]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={weights[f]}
                  onChange={(e) =>
                    setWeights((w) => ({ ...w, [f]: Number(e.target.value) }))
                  }
                />
              </label>
            ))}
          </div>
          <p className={styles.mono} style={{ fontSize: 12, color: 'var(--chd-amber)' }}>
            Weights sum: {sum}% {sum !== 100 ? '(normalise before live)' : ''}
          </p>
        </Panel>
        <div className={styles.stack}>
          <Panel title="Backtest" subtitle="Indexed performance">
            <div className={styles.chartMid} style={{ minHeight: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[...BACKTEST_SERIES]}>
                  <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                  <XAxis dataKey="y" tick={{ fill: '#8b949e', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#161b22',
                      border: '1px solid #30363d',
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="port"
                    stroke="#c9a84c"
                    strokeWidth={2}
                    name="Portfolio"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="asi"
                    stroke="#8b949e"
                    strokeDasharray="4 4"
                    name="NGX ASI"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Ann. return</div>
                <div className={styles.statVal}>14.2%</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Sharpe</div>
                <div className={styles.statVal}>1.08</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Max DD</div>
                <div className={styles.statVal}>-18.4%</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Info ratio</div>
                <div className={styles.statVal}>0.62</div>
              </div>
            </div>
            <button type="button" className={styles.btnGold} style={{ marginTop: 16 }}>
              Submit to live engine…
            </button>
          </Panel>
        </div>
      </div>
    </>
  )
}
