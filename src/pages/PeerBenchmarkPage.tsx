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
import { PEER_SERIES } from '../data/peerBench'
import styles from './ReportPages.module.css'

export function PeerBenchmarkPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>Peer benchmarking</h1>
      <p className={styles.pageSub}>
        Paramount vs African equity indices — indexed (mock quarterly).
      </p>
      <Panel title="3-year relative performance" subtitle="USD-adjusted toggle: Phase 3">
        <div className={styles.chartTall} style={{ minHeight: 380 }}>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={[...PEER_SERIES]}>
              <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
              <XAxis dataKey="m" tick={{ fill: '#8b949e', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: '#161b22',
                  border: '1px solid #30363d',
                  fontSize: 11,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="paramount" name="Paramount" stroke="#c9a84c" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ngx" name="NGX ASI" stroke="#8b949e" strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="jse" name="JSE" stroke="#58a6ff" dot={false} />
              <Line type="monotone" dataKey="egx" name="EGX 30" stroke="#3fb950" dot={false} />
              <Line type="monotone" dataKey="kenya" name="NSE 20" stroke="#d29922" dot={false} />
              <Line type="monotone" dataKey="msci" name="MSCI Front. Africa" stroke="#f85149" strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <div className={styles.twoCol} style={{ marginTop: 20 }}>
        <Panel title="Risk ratios" subtitle="Vs MSCI EM (illustrative)">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Market</th>
                <th>Sharpe</th>
                <th>Max DD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Paramount</td>
                <td>0.94</td>
                <td>-22%</td>
              </tr>
              <tr>
                <td>NGX</td>
                <td>0.71</td>
                <td>-28%</td>
              </tr>
              <tr>
                <td>JSE</td>
                <td>0.55</td>
                <td>-19%</td>
              </tr>
            </tbody>
          </table>
        </Panel>
        <Panel title="Exports">
          <button type="button" className={styles.btnOutline}>
            Download dataset (CSV)…
          </button>
        </Panel>
      </div>
    </>
  )
}
