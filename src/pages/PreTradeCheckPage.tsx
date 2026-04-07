import { useState } from 'react'
import { PreTradeModal, type PreTradeOutcome } from '../components/PreTradeModal'
import styles from './PreTradeCheckPage.module.css'

export function PreTradeCheckPage() {
  const [scenario, setScenario] = useState<PreTradeOutcome>('pass')
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <h1 className={styles.pageTitle}>Pre-trade mandate check</h1>
      <p className={styles.pageSub}>
        Gate orders against digitised trust-deed rules before they hit the OMS.
        This prototype demonstrates pass and blocked paths for the same ticket.
      </p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Demo scenario</h2>
        <div className={styles.scenario}>
          <label className={styles.radio}>
            <input
              type="radio"
              name="pretrade-scenario"
              checked={scenario === 'pass'}
              onChange={() => setScenario('pass')}
            />
            <span>
              <strong style={{ color: 'var(--chd-text)' }}>All checks pass</strong>
              — Execute enabled; ticket continues to routing.
            </span>
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="pretrade-scenario"
              checked={scenario === 'breach'}
              onChange={() => setScenario('breach')}
            />
            <span>
              <strong style={{ color: 'var(--chd-text)' }}>Single-stock breach</strong>
              — Execute disabled; Compliance must review or size adjusted.
            </span>
          </label>
        </div>
        <button
          type="button"
          className={styles.openBtn}
          onClick={() => setModalOpen(true)}
        >
          Run pre-trade check…
        </button>
        <p className={styles.hint}>
          Production: invoked automatically from NGX order entry and bond RFQ;
          sub-500ms SLA per PRD. ESC or backdrop click closes the modal.
        </p>
      </div>

      <PreTradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        outcome={scenario}
      />
    </>
  )
}
