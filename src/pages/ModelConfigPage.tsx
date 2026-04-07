import { useState } from 'react'
import { Panel } from '../components/Panel'
import styles from './ReportPages.module.css'

const SLEEVES = ['Equity alpha', 'Nigeria bonds', 'Eurobond', 'NIDF'] as const

export function ModelConfigPage() {
  const [mandateWarn, setMandateWarn] = useState(92)
  const [mandateHard, setMandateHard] = useState(98)

  return (
    <>
      <h1 className={styles.pageTitle}>Model configuration</h1>
      <p className={styles.pageSub}>
        Factor weights, mandate utilisation thresholds, maker-checker for production
        changes (mock controls).
      </p>
      <div className={styles.twoCol}>
        <Panel title="Mandate utilisation" subtitle="Alert vs block">
          <div className={styles.factorSliders}>
            <label style={{ display: 'block', marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span>Warning at %</span>
                <span className={styles.mono}>{mandateWarn}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={99}
                value={mandateWarn}
                onChange={(e) => setMandateWarn(Number(e.target.value))}
              />
            </label>
            <label style={{ display: 'block', marginBottom: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span>Hard stop at %</span>
                <span className={styles.mono}>{mandateHard}%</span>
              </div>
              <input
                type="range"
                min={mandateWarn}
                max={100}
                value={mandateHard}
                onChange={(e) => setMandateHard(Number(e.target.value))}
              />
            </label>
          </div>
          <p className={styles.prose} style={{ marginTop: 16, marginBottom: 0 }}>
            Pre-trade and blotter will surface warnings in the gold band; hard stop
            requires risk override with ticket ID.
          </p>
        </Panel>
        <Panel title="Sleeve defaults" subtitle="Rebalance cadence">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sleeve</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {SLEEVES.map((s) => (
                <tr key={s}>
                  <td>{s}</td>
                  <td>Monthly</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className={styles.btnOutline} style={{ marginTop: 16 }}>
            Request factor weight change…
          </button>
        </Panel>
      </div>
      <div style={{ marginTop: 20 }}>
        <Panel title="Maker-checker" subtitle="Pending approvals">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Change</th>
                <th>Proposed by</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Oil β cap 15% → 12%</td>
                <td className={styles.mono}>pm.equity</td>
                <td>
                  <span className={styles.badgeWarn}>Awaiting risk</span>
                </td>
              </tr>
              <tr>
                <td>Duration band +0.2y FI sleeve</td>
                <td className={styles.mono}>pm.fi</td>
                <td>
                  <span className={styles.badgeOk}>Approved</span>
                </td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  )
}
