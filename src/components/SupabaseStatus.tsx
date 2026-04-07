import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import styles from './SupabaseStatus.module.css'

type Status =
  | 'loading'
  | 'no_config'
  | 'ready'
  | 'no_table'
  | 'error'

export function SupabaseStatus() {
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const client = getSupabaseBrowserClient()
    if (!client) {
      setStatus('no_config')
      return
    }

    let cancelled = false

    void (async () => {
      const { error } = await client.from('chd_health').select('id').maybeSingle()
      if (cancelled) return
      if (error) {
        const msg = error.message?.toLowerCase() ?? ''
        if (
          error.code === '42P01' ||
          msg.includes('does not exist') ||
          msg.includes('schema cache')
        ) {
          setStatus('no_table')
        } else {
          setStatus('error')
        }
        return
      }
      setStatus('ready')
    })()

    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'loading') {
    return <div className={styles.line}>Checking database…</div>
  }

  if (status === 'no_config') {
    if (!import.meta.env.DEV) return null
    return (
      <div className={styles.line}>
        Supabase: add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local
      </div>
    )
  }

  if (status === 'ready') {
    return <div className={styles.lineOk}>Supabase database connected</div>
  }

  if (status === 'no_table') {
    return (
      <div className={styles.lineWarn}>
        Supabase: apply migration <span className={styles.mono}>chd_health</span> — SQL Editor or CLI{' '}
        <span className={styles.mono}>db push</span>
      </div>
    )
  }

  return (
    <div className={styles.lineErr}>
      Supabase: request failed — check publishable key and project URL
    </div>
  )
}
