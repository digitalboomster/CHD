import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Panel } from '../components/Panel'
import styles from './MacroRegime.module.css'

const radarData = [
  { axis: 'CBN MPR', value: 78 },
  { axis: 'CPI', value: 92 },
  { axis: 'NGN/USD', value: 71 },
  { axis: 'Brent', value: 45 },
  { axis: 'Cap. flows', value: 38 },
  { axis: 'Credit spr.', value: 65 },
]

const history = [
  { state: 'Tightening', color: '#f85149' },
  { state: 'Stagflation', color: '#d29922' },
  { state: 'Stagflation', color: '#d29922' },
  { state: 'Tightening', color: '#f85149' },
  { state: 'Recovery', color: '#3fb950' },
]

export function MacroRegime() {
  return (
    <>
      <h1
        className="serif"
        style={{ fontSize: 26, fontWeight: 600, margin: '0 0 8px' }}
      >
        Macro regime classifier
      </h1>
      <p style={{ color: 'var(--chd-text-muted)', margin: '0 0 22px' }}>
        Six-axis radar vs historical average · HMM states (mock)
      </p>

      <div className={styles.layout}>
        <Panel title="Regime inputs" subtitle="Normalised stress / deviation scores">
          <div className={styles.radarBox}>
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#30363d" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                />
                <Radar
                  name="Current"
                  dataKey="value"
                  stroke="#c9a84c"
                  fill="#c9a84c"
                  fillOpacity={0.35}
                />
                <Tooltip
                  contentStyle={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 12,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="AI regime read" subtitle="Gemini narrative · illustrative">
          <div className={styles.regimeLabel}>STAGFLATION</div>
          <div className={styles.confidence}>HIGH CONFIDENCE · 87%</div>
          <div className={styles.summary}>
            <p>
              <strong>MMF / Bond:</strong> favour shorter WAM and defensive
              duration until CPI trajectory confirms; watch NTB auction stop-out
              rates.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>Paramount:</strong> tilt to quality and exporters with
              natural FX hedge; oil-beta names monitored vs Brent path.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>NIDF:</strong> stress-test debt service under FX + rates;
              prioritise projects with tariff indexation.
            </p>
          </div>
          <div className={styles.timeline}>
            <div className={styles.tlTitle}>6-month state transitions</div>
            {history.map((h, i) => (
              <div key={i} className={styles.tlRow}>
                <span className={styles.dot} style={{ background: h.color }} />
                <span className="mono" style={{ color: 'var(--chd-text-dim)' }}>
                  M{i + 1}
                </span>
                <span>{h.state}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}
