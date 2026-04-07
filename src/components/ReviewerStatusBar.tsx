import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { isApiConfigured, getApiBaseUrl } from '../api/config'
import type { DataSource } from '../api/hooks'
import { useTickerStrip } from '../api/hooks'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import { deriveHandoffDataMode } from '../reviewer/dataMode'
import styles from './ReviewerStatusBar.module.css'

const COLLAPSE_KEY = 'chd_reviewer_strip_collapsed'

type ReviewerStatusBarProps = {
  fundsSource: DataSource
  fundsLoading: boolean
  fundsError: Error | null
  fundCount: number
  perfSource: DataSource
  perfError: Error | null
}

export function ReviewerStatusBar({
  fundsSource,
  fundsLoading,
  fundsError,
  fundCount,
  perfSource,
  perfError,
}: ReviewerStatusBarProps) {
  const [collapsed, setCollapsed] = useState(() =>
    typeof localStorage !== 'undefined'
      ? localStorage.getItem(COLLAPSE_KEY) === '1'
      : false,
  )

  const apiOn = isApiConfigured()
  const apiUrl = getApiBaseUrl()
  const { source: tickerSource } = useTickerStrip()
  const supabaseOn = getSupabaseBrowserClient() !== null

  const apiBooting = apiOn && fundsLoading && fundCount === 0 && !fundsError

  const mode = useMemo(
    () =>
      deriveHandoffDataMode(apiOn, apiBooting, {
        funds: fundsSource,
        perf: perfSource,
        ticker: tickerSource,
        fundsError: !!fundsError,
        perfError: !!perfError,
      }),
    [
      apiOn,
      apiBooting,
      fundsSource,
      perfSource,
      tickerSource,
      fundsError,
      perfError,
    ],
  )

  const { badgeClass, badgeLabel, detail, authNote } = useMemo(() => {
    if (mode === 'bundle') {
      return {
        badgeClass: styles.bundle,
        badgeLabel: 'Prototype data',
        detail:
          'No API URL set — funds, performance, and ticker use the bundled demo dataset. Add VITE_API_BASE_URL and run the mock API for live-shaped responses.',
        authNote: supabaseOn
          ? 'Supabase sign-in is configured.'
          : 'Auth shows Local — Supabase env vars optional for review.',
      }
    }
    if (mode === 'api_loading') {
      return {
        badgeClass: styles.loading,
        badgeLabel: 'Connecting',
        detail: `Calling ${apiUrl ?? 'API'} for funds and performance…`,
        authNote: supabaseOn ? 'Supabase: on' : 'Supabase: off',
      }
    }
    if (mode === 'api_live') {
      return {
        badgeClass: styles.live,
        badgeLabel: 'API data',
        detail:
          'Funds, performance series, and ticker are coming from your configured backend. Individual pages may still show static or stub widgets — see the handoff checklist.',
        authNote: supabaseOn ? 'Supabase: on' : 'Supabase: off',
      }
    }
    if (mode === 'api_mixed') {
      return {
        badgeClass: styles.mixed,
        badgeLabel: 'Mixed sources',
        detail:
          'Some feeds are live and others fell back to the prototype bundle. Co-pilot and PDF RAG still need the Node API + keys where noted in the checklist.',
        authNote: supabaseOn ? 'Supabase: on' : 'Supabase: off',
      }
    }
    return {
      badgeClass: styles.down,
      badgeLabel: 'API unreachable',
      detail:
        'Backend URL is set but calls failed or returned empty — showing prototype fallback. Start npm run mock:api (or your server) and confirm the URL matches.',
      authNote: supabaseOn ? 'Supabase: on' : 'Supabase: off',
    }
  }, [mode, apiUrl, supabaseOn])

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
  }

  return (
    <div className={styles.wrap} role="region" aria-label="Reviewer data status">
      {!collapsed ? (
        <>
          <div className={styles.main}>
            <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
            <span className={styles.detail}>{detail}</span>
            <span className={styles.authNote}>{authNote}</span>
          </div>
          <div className={styles.actions}>
            <Link to="/review/handoff" className={styles.link}>
              Handoff checklist
            </Link>
            <button
              type="button"
              className={styles.toggle}
              onClick={toggleCollapsed}
              aria-expanded
            >
              Hide
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.main}>
            <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
            <span className={styles.detail}>
              {apiOn ? apiUrl : 'No API URL'} · {authNote}
            </span>
          </div>
          <div className={styles.actions}>
            <Link to="/review/handoff" className={styles.link}>
              Checklist
            </Link>
            <button
              type="button"
              className={styles.toggle}
              onClick={toggleCollapsed}
              aria-expanded={false}
            >
              Show details
            </button>
          </div>
        </>
      )}
    </div>
  )
}
