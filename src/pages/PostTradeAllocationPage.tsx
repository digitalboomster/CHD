import { useState } from 'react'
import { Panel } from '../components/Panel'
import styles from './ReportPages.module.css'

const ROWS = [
  { fund: 'Paramount Equity', sleeve: 'NGX large-cap', notional: '₦180M', status: 'Matched' },
  { fund: 'Nigeria Bond', sleeve: 'FGN 27–35', notional: '₦420M', status: 'Partial' },
  { fund: 'Balanced', sleeve: 'Mixed', notional: '₦95M', status: 'Pending broker' },
]

export function PostTradeAllocationPage() {
  const [block, setBlock] = useState('BLK-2026-0402-881')

  return (
    <>
      <h1 className={styles.pageTitle}>Post-trade allocation</h1>
      <p className={styles.pageSub}>
        Block fills → fund sleeves, cash ladders, and settlement status (mock).
      </p>
      <Panel title="Block reference" subtitle="Search or paste from blotter">
        <input
          type="text"
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          className={styles.inputWide}
        />
      </Panel>
      <div style={{ marginTop: 20 }}>
        <Panel title="Allocation waterfall" subtitle={block} flush>
          <div style={{ overflow: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fund</th>
                  <th>Sleeve</th>
                  <th>Notional</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.fund + r.sleeve}>
                    <td>{r.fund}</td>
                    <td>{r.sleeve}</td>
                    <td className={styles.mono}>{r.notional}</td>
                    <td>
                      {r.status === 'Matched' ? (
                        <span className={styles.badgeOk}>{r.status}</span>
                      ) : r.status === 'Partial' ? (
                        <span className={styles.badgeWarn}>{r.status}</span>
                      ) : (
                        <span className={styles.badgeNeutral}>{r.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
      <div className={styles.twoCol} style={{ marginTop: 20 }}>
        <Panel title="Cash impact" subtitle="T+1 projection">
          <dl className={styles.kv}>
            <dt>Total debit</dt>
            <dd className={styles.mono}>₦695M</dd>
            <dt>Available liquidity</dt>
            <dd className={styles.mono}>₦1.02B</dd>
            <dt>Shortfall risk</dt>
            <dd>None</dd>
          </dl>
        </Panel>
        <Panel title="Actions">
          <div className={styles.stack}>
            <button type="button" className={styles.btnGold}>
              Confirm allocations
            </button>
            <button type="button" className={styles.btnOutline}>
              Export settlement pack…
            </button>
          </div>
        </Panel>
      </div>
    </>
  )
}
