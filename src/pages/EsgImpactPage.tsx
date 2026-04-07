import { Panel } from '../components/Panel'
import { ESG_KPIS, NIDF_IMPACT_ROWS, SDG_TILES } from '../data/esg'
import styles from './ReportPages.module.css'

export function EsgImpactPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>ESG &amp; impact</h1>
      <p className={styles.pageSub}>
        Cross-fund impact view — depth on NIDF &amp; Women&apos;s Balanced per PRD
        F-010.
      </p>
      <div className={styles.statRow} style={{ marginBottom: 24 }}>
        {ESG_KPIS.map((k) => (
          <div key={k.label} className={styles.statBox}>
            <div className={styles.statLabel}>{k.label}</div>
            <div className={styles.statVal}>
              {k.value}
              <span style={{ fontSize: 14, fontWeight: 500 }}>{k.suffix}</span>
            </div>
          </div>
        ))}
      </div>
      <Panel title="SDG contribution map" subtitle="By mandate sleeve (mock ₦)">
        <div className={styles.sdgGrid}>
          {SDG_TILES.map((t) => (
            <div key={t.id} className={styles.sdgCard}>
              <div className={styles.sdgId}>SDG {t.id}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{t.label}</div>
              <div className={styles.mono} style={{ fontSize: 12, marginTop: 8, color: 'var(--chd-gold)' }}>
                {t.amt}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <div style={{ marginTop: 20 }}>
        <Panel title="NIDF project impact" subtitle="Loan-level" flush>
          <div style={{ overflow: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Sector</th>
                  <th>Category</th>
                  <th>Beneficiaries</th>
                  <th>CO₂ avoided</th>
                </tr>
              </thead>
              <tbody>
                {NIDF_IMPACT_ROWS.map((r) => (
                  <tr key={r.project}>
                    <td>{r.project}</td>
                    <td>{r.sector}</td>
                    <td>{r.cat}</td>
                    <td>{r.ben}</td>
                    <td>{r.co2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: 16 }}>
            <button type="button" className={styles.btnGold}>
              Generate DFI report…
            </button>
          </div>
        </Panel>
      </div>
    </>
  )
}
