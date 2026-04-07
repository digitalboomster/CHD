import { Panel } from '../components/Panel'
import styles from './ReportPages.module.css'

const SECTIONS = [
  'Executive summary',
  'Performance attribution',
  'Top holdings changes',
  'Macro outlook',
  'Risk metrics',
  'Trade rationale',
  'Forward guidance',
] as const

export function IcDeckPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>IC presentation builder</h1>
      <p className={styles.pageSub}>
        Paramount Equity — Q1 2026 review deck; drag sections in Phase 3, AI fill
        now stubbed.
      </p>
      <div className={styles.grid2}>
        <Panel title="Slide sections" subtitle="Toggle AI populate per block">
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {SECTIONS.map((s) => (
              <li
                key={s}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--chd-border-subtle)',
                  gap: 12,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 13 }}>{s}</span>
                <button type="button" className={styles.btnOutline}>
                  AI generate
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className={styles.btnGold}>
              Export to Slides…
            </button>
            <button type="button" className={styles.btnOutline}>
              Export PowerPoint…
            </button>
          </div>
        </Panel>
        <Panel title="Deck preview" subtitle="8 slides">
          <div className={styles.thumbCol}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={styles.thumb}>
                Slide {i + 1}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}
