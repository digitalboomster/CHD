import { Panel } from '../components/Panel'
import styles from './ReportPages.module.css'

const ROLES = [
  { role: 'CIO', funds: 'All', last: '2026-03-28' },
  { role: 'PM — Equities', funds: 'Paramount Equity, Balanced', last: '2026-04-01' },
  { role: 'PM — FI', funds: 'Nigeria Bond, Balanced', last: '2026-03-30' },
  { role: 'Risk', funds: 'All (read)', last: '2026-03-15' },
  { role: 'Ops', funds: 'Trade, blotter', last: '2026-04-02' },
]

const AUDIT = [
  { when: '2026-04-02 09:14', who: 'a.okonkwo', action: 'Granted RFQ submit on Bond sleeve' },
  { when: '2026-04-01 16:02', who: 'risk.bot', action: 'Mandate threshold edit (pending approval)' },
  { when: '2026-03-29 11:40', who: 'c.adeyemi', action: 'Revoked NGX direct for intern group' },
]

export function RolesPermissionsPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>Roles & permissions</h1>
      <p className={styles.pageSub}>
        RBAC matrix, fund-scoped access, and recent audit events (prototype).
      </p>
      <Panel title="Role matrix" subtitle="Who can see what" flush>
        <div style={{ overflow: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Role</th>
                <th>Fund scope</th>
                <th>Last review</th>
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r.role}>
                  <td>{r.role}</td>
                  <td>{r.funds}</td>
                  <td className={styles.mono}>{r.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <div style={{ marginTop: 20 }}>
        <Panel title="Recent audit" subtitle="Permission changes">
          <ul className={styles.auditList}>
            {AUDIT.map((a) => (
              <li key={a.when + a.who}>
                <span className={styles.mono}>{a.when}</span>
                <span className={styles.auditWho}>{a.who}</span>
                <span>{a.action}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <div style={{ marginTop: 16 }}>
        <button type="button" className={styles.btnGold}>
          Invite user…
        </button>
      </div>
    </>
  )
}
