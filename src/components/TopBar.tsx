import { Link } from 'react-router-dom'
import type { FundDto } from '../api/types'
import { AuthMenu } from './AuthMenu'
import { RagPdfUpload } from './RagPdfUpload'
import { useProductTour } from '../tour/ProductTour'
import styles from './TopBar.module.css'

type TopBarProps = {
  funds: FundDto[]
  fundsLoading: boolean
  fundId: string
  onFundChange: (id: string) => void
  copilotOpen: boolean
  onToggleCopilot: () => void
}

export function TopBar({
  funds,
  fundsLoading,
  fundId,
  onFundChange,
  copilotOpen,
  onToggleCopilot,
}: TopBarProps) {
  const { startTour } = useProductTour()

  return (
    <header className={styles.bar}>
      <Link to="/" className={styles.brand} data-tour="topbar-brand">
        <span className={styles.mark}>CHD</span>
        <div className={styles.titles}>
          <span className={styles.title}>Quant Platform</span>
          <span className={styles.sub}>Mandate intelligence · NGX · FMDQ</span>
        </div>
      </Link>
      <div className={styles.controls}>
        <label htmlFor="fund-context" className="visually-hidden">
          Active fund context
        </label>
        <select
          id="fund-context"
          data-tour="fund-select"
          className={styles.fundSelect}
          value={funds.some((f) => f.id === fundId) ? fundId : ''}
          onChange={(e) => onFundChange(e.target.value)}
          disabled={fundsLoading && funds.length === 0}
          aria-busy={fundsLoading}
        >
          {funds.length === 0 ? (
            <option value="">Loading funds…</option>
          ) : null}
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          data-tour="copilot-btn"
          className={styles.copilotBtn}
          onClick={onToggleCopilot}
          aria-expanded={copilotOpen}
          aria-controls="chd-copilot-panel"
        >
          Co-pilot
        </button>
        <div className={styles.accountTools} data-tour="account-tools">
          <AuthMenu />
          <RagPdfUpload />
        </div>
        <button
          type="button"
          className={styles.tourBtn}
          onClick={() => startTour()}
          title="Guided tour of the workspace"
        >
          Tour
        </button>
        <div
          className={styles.iconWrap}
          title="Alerts — Phase 2 (OMS / risk feeds). Button is disabled until wired."
        >
          <button
            type="button"
            className={styles.iconBtnMuted}
            disabled
            aria-label="Notifications — not available yet"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5l-2 2v1h16v-1l-2-2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
