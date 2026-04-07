import { useOutletContext } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePerformanceSeries } from '../api/hooks'
import { isApiConfigured } from '../api/config'
import type { FundDto } from '../api/types'
import { KPICard } from '../components/KPICard'
import { Panel } from '../components/Panel'
import type { AppShellOutletContext } from '../types/shellContext'
import styles from './ExecutiveDashboard.module.css'

const COLORS = {
  paramount: '#c9a84c',
  bond: '#58a6ff',
  mmf: '#3fb950',
  asi: '#8b949e',
  ntb: '#f85149',
}

function statusPill(status: FundDto['status']) {
  if (status === 'in')
    return <span className={`${styles.pill} ${styles.pillIn}`}>In mandate</span>
  if (status === 'watch')
    return <span className={`${styles.pill} ${styles.pillWatch}`}>Watch</span>
  return <span className={`${styles.pill} ${styles.pillBreach}`}>Breach</span>
}

export function ExecutiveDashboard() {
  const { funds, fundsLoading, fundsError, fundsSource } =
    useOutletContext<AppShellOutletContext>()
  const {
    points: performancePoints,
    loading: perfLoading,
    error: perfError,
    source: perfSource,
  } = usePerformanceSeries()

  const apiOn = isApiConfigured()
  const usingFallback =
    !apiOn ||
    !!fundsError ||
    !!perfError ||
    (apiOn && fundsSource === 'mock') ||
    (apiOn && perfSource === 'mock')

  return (
    <>
      <h1 className={styles.pageTitle}>Executive dashboard</h1>
      <p className={styles.pageSub}>
        12-month indexed performance vs NGX ASI &amp; 91D NTB — all seven
        mandates
      </p>

      {usingFallback ? (
        <div className={styles.dataBanner} role="status">
          {!apiOn ? (
            <>
              Using the bundled prototype dataset. Set{' '}
              <code>VITE_API_BASE_URL</code> (and optionally{' '}
              <code>VITE_DEV_API_PROXY</code> for <code>npm run dev</code>) to
              consume the OpenAPI backend.
            </>
          ) : fundsError || perfError ? (
            <>
              Live API error
              {fundsError ? ` — funds: ${fundsError.message}` : ''}
              {perfError ? ` — performance: ${perfError.message}` : ''}. Showing
              fallback data.
            </>
          ) : (
            <>
              API reachable but returned empty payloads for one or more
              resources — prototype figures are shown until data is available.
            </>
          )}
        </div>
      ) : null}

      <div className={styles.kpiGrid}>
        <KPICard
          label="Total AUM"
          value="₦137.0B"
          delta="+2.1% QoQ"
          deltaTone="pos"
        />
        <KPICard
          label="Active funds"
          value={fundsLoading ? '—' : String(funds.length)}
          delta="All live"
        />
        <KPICard
          label="Today NAV Δ (agg.)"
          value="+0.18%"
          delta="vs prior close"
          deltaTone="pos"
        />
        <KPICard
          label="Mandate compliance"
          value="98.4%"
          delta="6 in · 1 watch · 0 breach"
          deltaTone="neutral"
        />
      </div>

      <div className={styles.chartWrap}>
        <Panel
          title="Performance"
          subtitle="Indexed — Paramount, Nigeria Bond, CHD MMF vs benchmarks"
        >
          <div className={styles.legend}>
            <span>
              <span
                className={styles.swatch}
                style={{ background: COLORS.paramount }}
              />
              Paramount
            </span>
            <span>
              <span
                className={styles.swatch}
                style={{ background: COLORS.bond }}
              />
              Nigeria Bond
            </span>
            <span>
              <span className={styles.swatch} style={{ background: COLORS.mmf }} />
              CHD MMF
            </span>
            <span>
              <span className={styles.swatch} style={{ background: COLORS.asi }} />
              NGX ASI
            </span>
            <span>
              <span className={styles.swatch} style={{ background: COLORS.ntb }} />
              91D NTB
            </span>
          </div>
          <div style={{ width: '100%', height: 320, minHeight: 320 }}>
            {perfLoading && performancePoints.length === 0 ? (
              <div
                style={{
                  height: 320,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--chd-text-muted)',
                  fontSize: 13,
                }}
              >
                Loading performance…
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={performancePoints}>
                  <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="m"
                    stroke="#6e7681"
                    tick={{ fill: '#8b949e', fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6e7681"
                    tick={{ fill: '#8b949e', fontSize: 11 }}
                    tickLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: 8,
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="paramount"
                    stroke={COLORS.paramount}
                    strokeWidth={2}
                    dot={false}
                    name="Paramount"
                  />
                  <Line
                    type="monotone"
                    dataKey="bond"
                    stroke={COLORS.bond}
                    strokeWidth={2}
                    dot={false}
                    name="Nigeria Bond"
                  />
                  <Line
                    type="monotone"
                    dataKey="mmf"
                    stroke={COLORS.mmf}
                    strokeWidth={2}
                    dot={false}
                    name="CHD MMF"
                  />
                  <Line
                    type="monotone"
                    dataKey="asi"
                    stroke={COLORS.asi}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="NGX ASI"
                  />
                  <Line
                    type="monotone"
                    dataKey="ntb"
                    stroke={COLORS.ntb}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="91D NTB"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className={styles.chartNote}>
            Mandate lines use solid strokes; benchmark series use a lighter
            weight and dashed strokes so portfolio vs index reads at a glance.
          </p>
        </Panel>
      </div>

      <Panel title="Fund overview" subtitle="NAV, benchmark, mandate status" flush>
        <div className={styles.tableWrap}>
          {fundsLoading && funds.length === 0 ? (
            <div
              style={{
                padding: '32px 24px',
                color: 'var(--chd-text-muted)',
                fontSize: 13,
              }}
            >
              Loading funds…
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fund</th>
                  <th>NAV / unit</th>
                  <th>1D</th>
                  <th>YTD</th>
                  <th>Benchmark</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div className={styles.fundName}>{f.name}</div>
                      <div className={styles.meta}>{f.mandate}</div>
                    </td>
                    <td>
                      {f.nav < 20 ? `₦${f.nav.toFixed(4)}` : `₦${f.nav.toFixed(2)}`}
                    </td>
                    <td
                      style={{
                        color:
                          f.navChange >= 0 ? 'var(--chd-green)' : 'var(--chd-red)',
                      }}
                    >
                      {f.navChange >= 0 ? '+' : ''}
                      {f.navChange.toFixed(2)}%
                    </td>
                    <td>{f.ytd.toFixed(1)}%</td>
                    <td>{f.benchmark}</td>
                    <td>{statusPill(f.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Panel>
    </>
  )
}
