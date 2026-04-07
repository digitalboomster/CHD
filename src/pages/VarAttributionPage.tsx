import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { KPICard } from '../components/KPICard'
import { Panel } from '../components/Panel'
import { VAR_ATTRIBUTION, VAR_HISTORY, VAR_KPIS, VAR_POSITIONS } from '../data/varRisk'
import styles from './ReportPages.module.css'

const stackData = VAR_ATTRIBUTION.map((x) => ({
  name: x.factor,
  v: x.pct,
}))

export function VarAttributionPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>VaR &amp; attribution</h1>
      <p className={styles.pageSub}>
        Nigeria Bond Fund — risk metrics, factor stacks, and position-level VaR
        contribution (prototype).
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginBottom: 20,
        }}
      >
        <KPICard label="1D VaR (95%)" value={VAR_KPIS.var95} />
        <KPICard label="1D CVaR" value={VAR_KPIS.cvar} />
        <KPICard label="DV01 (agg.)" value={VAR_KPIS.dv01} deltaTone="neutral" />
      </div>
      <div className={styles.twoCol}>
        <Panel title="Risk attribution" subtitle="Share of portfolio VaR by factor">
          <div className={styles.chartMid} style={{ minHeight: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[...stackData]} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke="#30363d" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" fill="#58a6ff" radius={[0, 4, 4, 0]} name="%" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Position VaR" subtitle="Top contributors">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Bond</th>
                <th>VaR contrib.</th>
              </tr>
            </thead>
            <tbody>
              {VAR_POSITIONS.map((r) => (
                <tr key={r.bond}>
                  <td>{r.bond}</td>
                  <td>{r.contrib}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
      <Panel title="VaR history" subtitle="90-day · internal limit line (mock)">
        <div className={styles.chartMid} style={{ minHeight: 300 }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...VAR_HISTORY]}>
              <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
              <XAxis dataKey="d" tick={{ fill: '#8b949e', fontSize: 11 }} />
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
                dataKey="v"
                stroke="#c9a84c"
                strokeWidth={2}
                dot={false}
                name="VaR"
              />
              <ReferenceLine
                y={190}
                stroke="#f85149"
                strokeDasharray="6 4"
                label={{ value: 'Limit', fill: '#f85149', fontSize: 11 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p style={{ fontSize: 12, color: 'var(--chd-amber)', marginTop: 12 }}>
          Alert if 1D VaR exceeds limit — MIE integration Phase 2.
        </p>
      </Panel>
    </>
  )
}
