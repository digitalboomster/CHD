import { useTickerStrip } from '../api/hooks'
import styles from './TickerTape.module.css'

function TapeSegment({
  items,
}: {
  items: { label: string; value: string; chg: string; up: boolean | null }[]
}) {
  return (
    <>
      {items.map((t) => (
        <span key={t.label} className={styles.item}>
          <span className={styles.label}>{t.label}</span>
          <span className={styles.value}>{t.value}</span>
          <span
            className={
              t.up === true
                ? styles.chgUp
                : t.up === false
                  ? styles.chgDown
                  : styles.chgNeutral
            }
          >
            {t.chg}
          </span>
        </span>
      ))}
    </>
  )
}

export function TickerTape() {
  const { items } = useTickerStrip()

  return (
    <div
      className={styles.wrap}
      data-tour="ticker"
      role="marquee"
      aria-label="Market ticker"
    >
      <div className={styles.track}>
        <TapeSegment items={items} />
        <TapeSegment items={items} />
      </div>
    </div>
  )
}
