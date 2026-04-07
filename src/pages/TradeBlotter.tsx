import { Panel } from '../components/Panel'
import { BLOTTER_ROWS } from '../data/mock'
import styles from './TradeBlotter.module.css'

function statusClass(s: (typeof BLOTTER_ROWS)[number]['status']) {
  if (s === 'pending') return `${styles.status} ${styles.pending}`
  if (s === 'executing') return `${styles.status} ${styles.executing}`
  return `${styles.status} ${styles.filled}`
}

export function TradeBlotter() {
  return (
    <>
      <h1 className="serif" style={{ fontSize: 26, fontWeight: 600, margin: '0 0 8px' }}>
        Trade blotter
      </h1>
      <p style={{ color: 'var(--chd-text-muted)', margin: '0 0 20px', maxWidth: '70ch', lineHeight: 1.5 }}>
        Multi-fund order log — filter by fund, state, and venue. Row selection
        will surface fills, partials, and execution analytics in Phase 2.
      </p>

      <Panel title="Orders" subtitle="NGX · FMDQ · OTC" flush>
        <div style={{ padding: '14px 16px 0' }}>
          <div className={styles.filters}>
            <button type="button" className={styles.chip}>
              All funds
            </button>
            <button type="button" className={styles.chip}>
              Today
            </button>
            <button type="button" className={styles.chip}>
              Pending
            </button>
            <button type="button" className={styles.chip}>
              Filled
            </button>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Fund</th>
                <th>Asset</th>
                <th>Symbol</th>
                <th>Side</th>
                <th>Qty</th>
                <th>Target</th>
                <th>Mkt</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {BLOTTER_ROWS.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td style={{ fontFamily: 'var(--font-sans)', fontSize: 12 }}>
                    {r.fund}
                  </td>
                  <td>{r.asset}</td>
                  <td style={{ color: 'var(--chd-gold)' }}>{r.sym}</td>
                  <td
                    className={r.side === 'BUY' ? styles.buy : styles.sell}
                  >
                    {r.side}
                  </td>
                  <td>{r.qty}</td>
                  <td>{r.target}</td>
                  <td>{r.mkt}</td>
                  <td>{r.venue}</td>
                  <td className={statusClass(r.status)}>{r.status}</td>
                  <td>{r.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.footer} style={{ padding: '0 16px 16px' }}>
          <span style={{ fontSize: 12, color: 'var(--chd-text-dim)' }}>
            Select a row for execution progress, partial fills, and AI timing
            suggestions (Phase 2).
          </span>
          <button type="button" className={styles.routeBtn}>
            Route via FMDQ RFQ
          </button>
        </div>
      </Panel>
    </>
  )
}
