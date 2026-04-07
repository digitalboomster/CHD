import { useEffect, useRef, useState } from 'react'
import { FGN_BONDS, RFQ_COUNTERPARTIES } from '../data/rfq'
import styles from './FmdqRfqPage.module.css'

type Side = 'buy' | 'sell'

const RFQ_SECONDS = 30

export function FmdqRfqPage() {
  const [bond, setBond] = useState<string>(FGN_BONDS[0].isin)
  const [side, setSide] = useState<Side>('buy')
  const [faceValue, setFaceValue] = useState('250000000')
  const [settlement, setSettlement] = useState('2026-04-09')
  const [rfqLive, setRfqLive] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RFQ_SECONDS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!rfqLive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    setSecondsLeft(RFQ_SECONDS)
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [rfqLive])

  const mid =
    (RFQ_COUNTERPARTIES[0].bid + RFQ_COUNTERPARTIES[0].ask) / 2

  return (
    <>
      <h1 className={styles.pageTitle}>FMDQ bond RFQ</h1>
      <p className={styles.pageSub}>
        Request quotes from multiple market makers, compare indicative yields,
        and document best execution before confirming allocation.
      </p>

      <div className={styles.layout}>
        <div className={styles.formCard}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="bond-isin">
              Bond
            </label>
            <select
              id="bond-isin"
              className={styles.select}
              value={bond}
              onChange={(e) => setBond(e.target.value)}
            >
              {FGN_BONDS.map((b) => (
                <option key={b.isin} value={b.isin}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Side</span>
            <div className={styles.toggleRow} role="group" aria-label="Order side">
              <button
                type="button"
                className={`${styles.toggle} ${side === 'buy' ? styles.toggleActive : ''}`}
                onClick={() => setSide('buy')}
              >
                Buy
              </button>
              <button
                type="button"
                className={`${styles.toggle} ${side === 'sell' ? styles.toggleActive : ''}`}
                onClick={() => setSide('sell')}
              >
                Sell
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="face">
              Face value (₦)
            </label>
            <input
              id="face"
              className={styles.input}
              value={faceValue}
              onChange={(e) => setFaceValue(e.target.value.replace(/[^\d]/g, ''))}
              inputMode="numeric"
              aria-describedby="face-hint"
            />
            <span id="face-hint" className="visually-hidden">
              Nigerian naira principal amount
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="settle">
              Settlement date
            </label>
            <input
              id="settle"
              type="date"
              className={styles.input}
              value={settlement}
              onChange={(e) => setSettlement(e.target.value)}
            />
          </div>

          <div className={styles.aiBlock}>
            <strong>Execution suggestion (illustrative):</strong> Stanbic IBTC at{' '}
            <span className={styles.mono}>19.82%</span> yield vs mid{' '}
            <span className={styles.mono}>{mid.toFixed(2)}%</span> — best depth on last
            five comparable tickets (mock).
          </div>

          <div className={styles.countdown}>
            {rfqLive && secondsLeft > 0 ? (
              <span className={styles.timer} aria-live="polite">
                {secondsLeft}s
              </span>
            ) : rfqLive && secondsLeft === 0 ? (
              <span className={styles.timerWaiting}>Window closed — refresh RFQ</span>
            ) : (
              <span className={styles.timerWaiting}>No active RFQ</span>
            )}
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={rfqLive && secondsLeft > 0}
              onClick={() => {
                if (rfqLive && secondsLeft === 0) {
                  setRfqLive(false)
                  return
                }
                setRfqLive(true)
              }}
            >
              {rfqLive && secondsLeft === 0
                ? 'New RFQ'
                : rfqLive
                  ? 'RFQ live…'
                  : 'Send RFQ'}
            </button>
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.gridTitle}>Market makers · indicative</h2>
          <div className={styles.cpGrid}>
            {RFQ_COUNTERPARTIES.map((c) => (
              <div
                key={c.id}
                className={`${styles.cpRow} ${c.recommended ? styles.rowRec : ''}`}
              >
                <div>
                  <div className={styles.cpName}>{c.name}</div>
                  {c.recommended ? (
                    <div className={styles.cpRec}>Suggested venue</div>
                  ) : null}
                </div>
                <div className={styles.cpMono}>
                  {c.bid.toFixed(2)} / {c.ask.toFixed(2)}
                </div>
                <div className={styles.cpMono}>YTM</div>
                <div className={styles.cpRating}>{c.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
