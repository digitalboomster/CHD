import { Suspense, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useFunds, usePerformanceSeries } from '../api/hooks'
import { CopilotDrawer } from '../components/CopilotDrawer'
import { ReviewerStatusBar } from '../components/ReviewerStatusBar'
import { Sidebar } from '../components/Sidebar'
import { TickerTape } from '../components/TickerTape'
import { TopBar } from '../components/TopBar'
import type { AppShellOutletContext } from '../types/shellContext'
import styles from './AppShell.module.css'

export function AppShell() {
  const [fundId, setFundId] = useState('paramount')
  const [copilotOpen, setCopilotOpen] = useState(false)
  const { funds, loading: fundsLoading, error: fundsError, source: fundsSource } =
    useFunds()
  const { error: perfError, source: perfSource } = usePerformanceSeries()

  const activeFundLabel = useMemo(() => {
    const f = funds.find((x) => x.id === fundId)
    return f?.name ?? 'All funds'
  }, [funds, fundId])

  useEffect(() => {
    if (!funds.length) return
    if (!funds.some((f) => f.id === fundId)) {
      setFundId(funds[0].id)
    }
  }, [funds, fundId])

  const outletContext = useMemo<AppShellOutletContext>(
    () => ({
      fundId,
      activeFundLabel,
      funds,
      fundsLoading,
      fundsError,
      fundsSource,
    }),
    [fundId, activeFundLabel, funds, fundsLoading, fundsError, fundsSource],
  )

  return (
    <div className={styles.shell}>
      <TopBar
        funds={funds}
        fundsLoading={fundsLoading}
        fundId={fundId}
        onFundChange={setFundId}
        copilotOpen={copilotOpen}
        onToggleCopilot={() => setCopilotOpen((v) => !v)}
      />
      <ReviewerStatusBar
        fundsSource={fundsSource}
        fundsLoading={fundsLoading}
        fundsError={fundsError}
        fundCount={funds.length}
        perfSource={perfSource}
        perfError={perfError}
      />
      <TickerTape />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.mainInner} data-tour="main-content">
            <Suspense
              fallback={
                <div className={styles.routeFallback} role="status" aria-live="polite">
                  Loading…
                </div>
              }
            >
              <Outlet context={outletContext} />
            </Suspense>
          </div>
        </main>
      </div>
      <CopilotDrawer
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        activeFundLabel={activeFundLabel}
      />
    </div>
  )
}
