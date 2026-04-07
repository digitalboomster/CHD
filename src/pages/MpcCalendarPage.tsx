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
import styles from './ReportPages.module.css'

const MPC = [
  { meet: 'Jul 25', mpr: 27.5, decision: 'hold' },
  { meet: 'Sep 25', mpr: 27.5, decision: 'hold' },
  { meet: 'Nov 25', mpr: 27.5, decision: 'hold' },
  { meet: 'Jan 26', mpr: 27.5, decision: 'hold' },
  { meet: 'Mar 26', mpr: 27.5, decision: 'hold' },
]

export function MpcCalendarPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>CBN MPC calendar</h1>
      <p className={styles.pageSub}>
        Next meeting countdown, recent decisions, economist consensus (prototype).
      </p>
      <div className={styles.twoCol}>
        <Panel title="Next MPC" subtitle="Illustrative date">
          <div
            className={styles.statVal}
            style={{ fontSize: 36, color: 'var(--chd-gold)', marginBottom: 8 }}
          >
            23d 14h
          </div>
          <p className={styles.mono} style={{ color: 'var(--chd-text-muted)', margin: 0 }}>
            Current MPR <strong style={{ color: 'var(--chd-text)' }}>27.50%</strong>
          </p>
        </Panel>
        <Panel title="Consensus" subtitle="Economist survey (mock)">
          <dl className={styles.kv}>
            <dt>Hike</dt>
            <dd>20%</dd>
            <dt>Hold</dt>
            <dd>65%</dd>
            <dt>Cut</dt>
            <dd>15%</dd>
          </dl>
          <p className={styles.prose} style={{ marginTop: 16, marginBottom: 0 }}>
            <strong>CHD model:</strong> HOLD 72% — inflation still binding vs fiscal
            pressure.
          </p>
        </Panel>
      </div>
      <div style={{ marginTop: 20 }}>
        <Panel title="MPC history" subtitle="Rate path" flush>
          <div className={styles.chartMid} style={{ padding: 16, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={MPC}>
                <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                <XAxis dataKey="meet" tick={{ fill: '#8b949e', fontSize: 11 }} />
                <YAxis domain={[26, 28]} tick={{ fill: '#8b949e', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    fontSize: 12,
                  }}
                />
                <Line type="stepAfter" dataKey="mpr" stroke="#c9a84c" strokeWidth={2} dot={{ r: 4, fill: '#c9a84c' }} name="MPR" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </>
  )
}
