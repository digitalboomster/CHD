import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Panel } from '../components/Panel'
import {
  STRESS_FUND_ROWS,
  STRESS_MATRIX,
  STRESS_SCENARIOS,
  WATERFALL_FACTORS,
} from '../data/stress'
import styles from './StressTestingPage.module.css'

function heatColor(pct: number): string {
  if (pct >= -1) return 'rgba(63, 185, 80, 0.35)'
  if (pct >= -5) return 'rgba(210, 153, 34, 0.28)'
  if (pct >= -12) return 'rgba(248, 81, 73, 0.22)'
  return 'rgba(248, 81, 73, 0.42)'
}

export function StressTestingPage() {
  const [activeScenario, setActiveScenario] = useState(0)
  const totalImpact = WATERFALL_FACTORS.reduce((s, f) => s + f.value, 0)

  const barData = WATERFALL_FACTORS.map((f) => ({
    name: f.name,
    v: f.value,
  }))

  return (
    <>
      <h1 className={styles.pageTitle}>Stress testing</h1>
      <p className={styles.pageSub}>
        Nigeria-calibrated shocks — fund-level P&amp;L impact grid and loss
        decomposition for the active scenario (illustrative).
      </p>

      <div className={styles.chips} role="tablist" aria-label="Scenario presets">
        {STRESS_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === activeScenario}
            className={`${styles.chip} ${i === activeScenario ? styles.chipActive : ''}`}
            onClick={() => setActiveScenario(i)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <Panel
        title="Impact heat map"
        subtitle="Approximate one-day fund P&amp;L % under each shock (mock)"
        flush
      >
        <div className={styles.tableWrap}>
          <table className={styles.heatTable}>
            <thead>
              <tr>
                <th>Fund</th>
                {STRESS_SCENARIOS.map((s) => (
                  <th key={s.id}>{s.short}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STRESS_FUND_ROWS.map((row, ri) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {STRESS_MATRIX[ri]?.map((pct, ci) => (
                    <td key={ci}>
                      <span
                        className={styles.cell}
                        style={{
                          display: 'inline-block',
                          minWidth: '4.5rem',
                          padding: '4px 8px',
                          background: heatColor(pct),
                          color: pct < -8 ? '#fca5a5' : 'var(--chd-text)',
                        }}
                      >
                        {pct > 0 ? '+' : ''}
                        {pct.toFixed(1)}%
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className={styles.split}>
        <Panel
          title="Loss decomposition"
          subtitle={`Scenario: ${STRESS_SCENARIOS[activeScenario]?.label} — Paramount Equity (mock)`}
        >
          <div className={styles.chartBox} style={{ minHeight: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                  axisLine={{ stroke: '#30363d' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" fill="#f85149" radius={[4, 4, 0, 0]} name="Impact %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: 12, color: 'var(--chd-text-dim)', marginTop: 12 }}>
            Stacked interpretation: sum of factor shocks ≈{' '}
            <span className="mono" style={{ color: 'var(--chd-red)', fontWeight: 600 }}>
              {totalImpact.toFixed(1)}%
            </span>{' '}
            vs prior day NAV (prototype).
          </p>
        </Panel>

        <Panel title="Custom scenario" subtitle="Phase 3 — builder placeholder">
          <p style={{ fontSize: 13, color: 'var(--chd-text-muted)', lineHeight: 1.5 }}>
            CIO-defined shocks (e.g. parallel shift + FX step) will plug into the
            same engine; parameters follow PRD F-007 acceptance criteria.
          </p>
          <div className={styles.footer}>
            <button type="button" className={styles.exportBtn}>
              Export to PDF…
            </button>
          </div>
        </Panel>
      </div>
    </>
  )
}
