import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Panel } from '../components/Panel'
import { ALPHA_ROWS } from '../data/mock'
import styles from './AlphaSignals.module.css'

const factorData = [
  { name: 'Mom', v: 0.62 },
  { name: 'Value', v: 0.41 },
  { name: 'Qual', v: 0.55 },
  { name: 'Oil', v: 0.78 },
]

function actionClass(a: (typeof ALPHA_ROWS)[number]['action']) {
  if (a === 'BUY') return `${styles.action} ${styles.buy}`
  if (a === 'SELL') return `${styles.action} ${styles.sell}`
  return `${styles.action} ${styles.hold}`
}

export function AlphaSignals() {
  return (
    <>
      <h1 className="serif" style={{ fontSize: 26, fontWeight: 600, margin: '0 0 8px' }}>
        Alpha signals — Paramount
      </h1>
      <p style={{ color: 'var(--chd-text-muted)', margin: '0 0 20px', maxWidth: '70ch', lineHeight: 1.5 }}>
        Multi-factor NGX universe — sortable grid with sector and score filters.
        Side panel shows factor contribution for the selected name.
      </p>

      <div className={styles.side}>
        <Panel
          title="Ranked universe"
          subtitle="Daily refresh · mock scores"
          action={
            <div className={styles.filters}>
              <select className={styles.select} aria-label="Sector">
                <option>All sectors</option>
                <option>Financials</option>
                <option>Energy</option>
                <option>Materials</option>
              </select>
              <label className={styles.sliderLabel}>
                Min score
                <input type="range" min={0} max={100} defaultValue={40} />
              </label>
            </div>
          }
        >
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Sector</th>
                  <th>Signal</th>
                  <th>Mom</th>
                  <th>Earn Δ</th>
                  <th>Oil β</th>
                  <th>Liq</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ALPHA_ROWS.map((r) => (
                  <tr key={r.ticker}>
                    <td className={styles.ticker}>{r.ticker}</td>
                    <td>{r.sector}</td>
                    <td>
                      <div className={styles.signalCell}>
                        <div className={styles.spark}>
                          <div
                            className={styles.sparkFill}
                            style={{ width: `${r.score}%` }}
                          />
                        </div>
                        <span className={styles.signalVal}>{r.score}</span>
                      </div>
                    </td>
                    <td>{r.mom.toFixed(2)}</td>
                    <td>{r.earn.toFixed(2)}</td>
                    <td>{r.oil.toFixed(2)}</td>
                    <td>{r.liq.toFixed(2)}</td>
                    <td>
                      <span className={actionClass(r.action)}>{r.action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Factor contribution" subtitle="Selected: SEPLAT (mock)">
          <div style={{ height: 200, minHeight: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={factorData} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={36}
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="v" fill="#58a6ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className={styles.sideNote}>
            Factor loadings for the active row — same data powers the live signal
            engine in Phase 2.
          </p>
        </Panel>
      </div>
    </>
  )
}
