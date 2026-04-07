import { NavLink } from 'react-router-dom'
import { useProductTour } from '../tour/ProductTour'
import { SupabaseStatus } from './SupabaseStatus'
import styles from './Sidebar.module.css'

const groups: {
  label: string
  items: { to: string; label: string }[]
}[] = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Executive dashboard' },
      { to: '/funds/nidf', label: 'NIDF overview' },
      { to: '/macro', label: 'Macro regime' },
    ],
  },
  {
    label: 'Quant & signals',
    items: [
      { to: '/signals/equity', label: 'Alpha — equities' },
      { to: '/signals/fi', label: 'Fixed income & curve' },
      { to: '/signals/eurobond', label: 'Eurobond / USD' },
      { to: '/research/backtest', label: 'Factor backtest' },
    ],
  },
  {
    label: 'Compliance & risk',
    items: [
      { to: '/compliance', label: 'Mandate monitor' },
      { to: '/compliance/pre-trade', label: 'Pre-trade check' },
      { to: '/risk/stress', label: 'Stress testing' },
      { to: '/risk/var', label: 'VaR & attribution' },
    ],
  },
  {
    label: 'Execution',
    items: [
      { to: '/trade/blotter', label: 'Trade blotter' },
      { to: '/trade/rfq', label: 'FMDQ RFQ' },
      { to: '/trade/ngx', label: 'NGX order entry' },
      { to: '/trade/allocation', label: 'Post-trade allocation' },
    ],
  },
  {
    label: 'Reporting',
    items: [
      { to: '/reports/factsheet', label: 'Factsheets' },
      { to: '/reports/ic', label: 'IC deck builder' },
      { to: '/reports/esg', label: 'ESG & impact' },
    ],
  },
  {
    label: 'Research',
    items: [
      { to: '/research/macro-terminal', label: 'Macro terminal' },
      { to: '/research/security', label: 'Security deep-dive' },
      { to: '/research/peer', label: 'Peer benchmark' },
      { to: '/research/mpc', label: 'CBN MPC calendar' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { to: '/settings/users', label: 'Roles & permissions' },
      { to: '/settings/models', label: 'Model configuration' },
    ],
  },
  {
    label: 'Handoff',
    items: [{ to: '/review/handoff', label: 'Reviewer checklist' }],
  },
]

export function Sidebar() {
  const { startTour, resetTourProgress } = useProductTour()

  return (
    <aside className={styles.aside} data-tour="sidebar-nav">
      {groups.map((g) => (
        <div key={g.label}>
          <div className={styles.groupLabel}>{g.label}</div>
          <nav className={styles.nav} aria-label={g.label}>
            {g.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={styles.link}
              >
                <span className={styles.dot} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      ))}
      <div className={styles.footer}>
        <div>Prototype dataset · Nigerian market session 10:00–15:00 WAT</div>
        <div className={styles.tourRow}>
          <button
            type="button"
            className={styles.tourLink}
            onClick={() => {
              resetTourProgress()
              startTour()
            }}
          >
            Replay product tour
          </button>
        </div>
        <SupabaseStatus />
      </div>
    </aside>
  )
}
