import styles from './PlaceholderPage.module.css'

type PlaceholderPageProps = {
  title: string
  description?: string
  stitch?: string
}

export function PlaceholderPage({ title, description, stitch }: PlaceholderPageProps) {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      {description ? <p className={styles.desc}>{description}</p> : null}
      {stitch ? (
        <div className={styles.meta}>
          Specification reference: <code>{stitch}</code>
          <br />
          Not yet implemented in this prototype — connect data sources and
          workflows per delivery phase.
        </div>
      ) : null}
    </div>
  )
}
