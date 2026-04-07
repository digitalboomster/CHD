import styles from './KPICard.module.css'

type KPICardProps = {
  label: string
  value: string
  delta?: string
  deltaTone?: 'pos' | 'neg' | 'neutral'
}

export function KPICard({ label, value, delta, deltaTone = 'neutral' }: KPICardProps) {
  const deltaClass =
    deltaTone === 'pos'
      ? styles.deltaPos
      : deltaTone === 'neg'
        ? styles.deltaNeg
        : styles.deltaNeutral

  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {delta ? (
        <span className={`${styles.delta} ${deltaClass}`}>{delta}</span>
      ) : null}
    </div>
  )
}
