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
import { NIDF_SECTORS } from '../data/mock'
import styles from './NIDFOverview.module.css'

const repayments = [
  { date: 'Apr 2026', label: 'Power — coupon + principal', amt: '₦4.2B' },
  { date: 'Jun 2026', label: 'Transport — scheduled principal', amt: '₦1.8B' },
  { date: 'Sep 2026', label: 'Housing — bullet repayment', amt: '₦2.1B' },
]

export function NIDFOverview() {
  return (
    <>
      <h1 className={styles.pageTitle}>Nigeria Infrastructure Debt Fund</h1>
      <p style={{ color: 'var(--chd-text-muted)', margin: '0 0 22px', maxWidth: '70ch', lineHeight: 1.5 }}>
        28-loan portfolio — sector concentration, weighted yield, and repayment
        visibility for IC and liquidity planning.
      </p>

      <div className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.heroLabel}>NAV per unit</div>
          <div className={styles.heroValue}>₦108.20</div>
          <div className={styles.heroSub}>+0.38% QoQ (mock)</div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroLabel}>Total assets</div>
          <div className={styles.heroValue}>₦137.79B</div>
          <div className={styles.heroSub}>NIDF reported · Dec 2025 baseline</div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroLabel}>Profit after tax</div>
          <div className={styles.heroValue}>₦12.4B</div>
          <div className={styles.heroSub}>TTM illustrative</div>
        </div>
      </div>

      <div className={styles.grid}>
        <Panel
          title="Loans by sector"
          subtitle="Horizontal allocation — 28 facilities (mock counts)"
        >
          <div style={{ width: '100%', height: 280, minHeight: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={[...NIDF_SECTORS]}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid stroke="#30363d" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={88}
                  stroke="#6e7681"
                  tick={{ fill: '#8b949e', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(201,168,76,0.08)' }}
                  contentStyle={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="loans" fill="#c9a84c" radius={[0, 4, 4, 0]} name="Loans" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Key metrics" subtitle="Mandate intelligence snapshot">
          <div className={styles.metrics}>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Weighted avg. yield</span>
              <span className={styles.metricValue}>22.31%</span>
            </div>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Remaining avg. life</span>
              <span className={styles.metricValue}>7.11 yr</span>
            </div>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Top 5 concentration</span>
              <span className={styles.metricValue}>41.2%</span>
            </div>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>WAY vs floor</span>
              <span className={styles.metricValue}>In mandate</span>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Upcoming repayments" subtitle="Liquidity ladder — illustrative">
        <div className={styles.timeline}>
          {repayments.map((r) => (
            <div key={r.date} className={styles.timelineItem}>
              <span className={styles.date}>{r.date}</span>
              <div>
                <div style={{ color: 'var(--chd-text)' }}>{r.label}</div>
                <div
                  className="mono"
                  style={{ color: 'var(--chd-text-muted)', marginTop: 4 }}
                >
                  {r.amt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}
