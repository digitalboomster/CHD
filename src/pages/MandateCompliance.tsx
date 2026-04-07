import { FUNDS } from '../data/mock'
import styles from './MandateCompliance.module.css'

const metrics = ['WAM', 'Conc.', 'Credit', 'Liq.', 'FX'] as const

function dotsForFund(id: string) {
  if (id === 'bond') return ['ok', 'ok', 'warn', 'ok', 'ok'] as const
  return ['ok', 'ok', 'ok', 'ok', 'ok'] as const
}

export function MandateCompliance() {
  return (
    <>
      <h1 className="serif" style={{ fontSize: 26, fontWeight: 600, margin: '0 0 8px' }}>
        Mandate intelligence
      </h1>
      <p style={{ color: 'var(--chd-text-muted)', margin: '0 0 18px' }}>
        Per-fund MIE snapshot · pre-trade gate (P11)
      </p>

      <div className={styles.banner}>
        <strong>6 funds in compliance</strong> · 1 on watch · 0 breaches today
      </div>

      <div className={styles.grid}>
        {FUNDS.map((f) => {
          const dots = dotsForFund(f.id)
          const score = f.status === 'watch' ? 82 : 96 + (f.id.length % 3)
          return (
            <div key={f.id} className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <div className={styles.fund}>{f.name}</div>
                  <div className={styles.mandate}>{f.mandate}</div>
                </div>
                <div className={styles.score}>{score}%</div>
              </div>
              <div className={styles.dots}>
                {metrics.map((m, i) => (
                  <span
                    key={m}
                    title={m}
                    className={`${styles.dot} ${
                      dots[i] === 'ok'
                        ? styles.ok
                        : dots[i] === 'warn'
                          ? styles.warn
                          : styles.bad
                    }`}
                  />
                ))}
              </div>
              <div className={styles.dotLabel}>
                {metrics.join(' · ')}
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btn}>
          Generate SEC report…
        </button>
      </div>
    </>
  )
}
