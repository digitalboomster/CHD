import { useEffect, useId } from 'react'
import styles from './PreTradeModal.module.css'

export type PreTradeOutcome = 'pass' | 'breach'

type PreTradeModalProps = {
  open: boolean
  onClose: () => void
  outcome: PreTradeOutcome
}

function IconPass() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2 6l3 3 5-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconFail() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3 3l6 6M9 3L3 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PreTradeModal({ open, onClose, outcome }: PreTradeModalProps) {
  const titleId = useId()
  const breached = outcome === 'breach'

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const checks: {
    key: string
    label: string
    ok: boolean
    detail: string
  }[] = [
    {
      key: 'sector',
      label: 'Sector concentration',
      ok: true,
      detail: 'Materials at 18.2% vs 25% limit — headroom sufficient.',
    },
    {
      key: 'single',
      label: 'Single-stock limit',
      ok: !breached,
      detail: breached
        ? 'Post-trade Dangote Cement would be 8.6% of fund NAV (limit 8.0%).'
        : 'Post-trade position 7.4% of NAV — within 8.0% single-name cap.',
    },
    {
      key: 'bench',
      label: 'Benchmark deviation',
      ok: true,
      detail: 'Estimated tracking error +42 bps vs NGX 30 — inside 4% annual guardrail.',
    },
    {
      key: 'liq',
      label: 'Liquidity constraint',
      ok: true,
      detail: 'Order ~0.31% of 15-day ADV — passes internal liquidity screen.',
    },
    {
      key: 'esg',
      label: 'ESG screen',
      ok: true,
      detail: 'Issuer on approved list; no contested sector flags.',
    },
  ]

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.head}>
          <div>
            <h2 id={titleId} className={styles.title}>
              Pre-trade mandate check
            </h2>
            <p className={styles.sub}>Paramount Equity Fund · MIE v0 (prototype)</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.tradeCard}>
            <div className={styles.tradeLabel}>Proposed trade</div>
            <dl className={styles.tradeGrid}>
              <div>
                <dt>Direction</dt>
                <dd>BUY</dd>
              </div>
              <div>
                <dt>Instrument</dt>
                <dd>DANGCEM · NGX</dd>
              </div>
              <div>
                <dt>Quantity</dt>
                <dd>12,400 shares</dd>
              </div>
              <div>
                <dt>Notional (est.)</dt>
                <dd>₦6.01M @ ₦484.20</dd>
              </div>
            </dl>
          </div>

          <div>
            <div className={styles.checksTitle}>Mandate checks</div>
            <ul className={styles.checkList}>
              {checks.map((c) => (
                <li
                  key={c.key}
                  className={`${styles.checkRow} ${!c.ok ? styles.checkRowFail : ''}`}
                >
                  <span className={c.ok ? styles.iconPass : styles.iconFail}>
                    {c.ok ? <IconPass /> : <IconFail />}
                  </span>
                  <div>
                    <p className={styles.checkName}>{c.label}</p>
                    <p className={styles.checkDetail}>{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {breached ? (
            <div className={styles.alert} role="status">
              <strong>Mandate breach.</strong> Execute is blocked until size is
              reduced or an exemption is logged with Compliance.
              <div className={styles.suggest}>
                Suggested max: <strong>11,200 shares</strong> (~7.95% NAV) · or
                split across sessions.
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.foot}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            disabled={breached}
            title={breached ? 'Resolve single-stock limit before execution' : undefined}
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  )
}
