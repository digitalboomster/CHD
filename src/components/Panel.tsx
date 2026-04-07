import type { ReactNode } from 'react'
import styles from './Panel.module.css'

type PanelProps = {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  flush?: boolean
}

export function Panel({ title, subtitle, action, children, flush }: PanelProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle ? <p className={styles.sub}>{subtitle}</p> : null}
        </div>
        {action ? <div className={styles.actionSlot}>{action}</div> : null}
      </div>
      <div className={flush ? styles.bodyFlush : styles.body}>{children}</div>
    </section>
  )
}
