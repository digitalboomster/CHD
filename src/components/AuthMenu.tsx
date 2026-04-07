import { useCallback, useId, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import styles from './AuthMenu.module.css'

export function AuthMenu() {
  const { user, loading, supabaseReady, signIn, signUp, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const panelId = useId()

  const resetForm = useCallback(() => {
    setEmail('')
    setPassword('')
    setMsg(null)
  }, [])

  const onSignIn = useCallback(async () => {
    setBusy(true)
    setMsg(null)
    const { error } = await signIn(email.trim(), password)
    setBusy(false)
    if (error) {
      setMsg(error)
      return
    }
    resetForm()
    setOpen(false)
  }, [email, password, signIn, resetForm])

  const onSignUp = useCallback(async () => {
    setBusy(true)
    setMsg(null)
    const { error } = await signUp(email.trim(), password)
    setBusy(false)
    if (error) {
      setMsg(error)
      return
    }
    setMsg('Check your email to confirm, or sign in if confirmations are off.')
  }, [email, password, signUp])

  if (!supabaseReady) {
    return <span className={styles.localBadge}>Local</span>
  }

  if (loading) {
    return <span className={styles.localBadge}>…</span>
  }

  if (user) {
    const label =
      user.email?.split('@')[0] ??
      user.user_metadata?.full_name ??
      'Signed in'
    return (
      <div className={styles.wrap}>
        <span className={styles.userLabel} title={user.email ?? ''}>
          {label}
        </span>
        <button
          type="button"
          className={styles.textBtn}
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.signInBtn}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen((v) => !v)
          setMsg(null)
        }}
      >
        Sign in
      </button>
      {open ? (
        <div id={panelId} className={styles.panel} role="dialog" aria-label="Sign in">
          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
          </label>
          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
            />
          </label>
          {msg ? <p className={styles.msg}>{msg}</p> : null}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              disabled={busy}
              onClick={() => void onSignIn()}
            >
              Sign in
            </button>
            <button
              type="button"
              className={styles.secondary}
              disabled={busy}
              onClick={() => void onSignUp()}
            >
              Sign up
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
