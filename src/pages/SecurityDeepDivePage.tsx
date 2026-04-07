import { useState } from 'react'
import { Panel } from '../components/Panel'
import styles from './ReportPages.module.css'

export function SecurityDeepDivePage() {
  const [q, setQ] = useState('FGN MAR 2035')

  return (
    <>
      <h1 className={styles.pageTitle}>Security deep-dive</h1>
      <p className={styles.pageSub}>
        NGX · ISIN · FGN — statics, comparables, mandate quick take (mock).
      </p>
      <Panel title="Search" subtitle="Ticker, ISIN, or bond name">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          style={{
            width: '100%',
            maxWidth: 480,
            minHeight: 44,
            padding: '0 14px',
            borderRadius: 8,
            border: '1px solid var(--chd-border)',
            background: 'var(--chd-surface-input)',
            color: 'var(--chd-text)',
            fontSize: 14,
          }}
        />
      </Panel>
      <div className={styles.twoCol} style={{ marginTop: 20 }}>
        <Panel title="FGN MAR 2035" subtitle="Selected instrument">
          <dl className={styles.kv}>
            <dt>YTM</dt>
            <dd>19.82%</dd>
            <dt>Mod. duration</dt>
            <dd>6.42</dd>
            <dt>Convexity</dt>
            <dd>58.3</dd>
            <dt>Rating</dt>
            <dd>NG AAA (local)</dd>
            <dt>FMDQ bid/ask</dt>
            <dd>4.2 / 5.8 bps</dd>
            <dt>Outstanding</dt>
            <dd>₦2.1T equiv.</dd>
          </dl>
        </Panel>
        <div className={styles.stack}>
          <Panel title="Comparables" subtitle="Similar curve points">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Bond</th>
                  <th>Spread</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>FGN 2032</td>
                  <td>-6 bps</td>
                </tr>
                <tr>
                  <td>FGN 2038</td>
                  <td>+11 bps</td>
                </tr>
                <tr>
                  <td>FGN 2049</td>
                  <td>+28 bps</td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel title="AI quick take" subtitle="Bond fund mandate fit">
            <p className={styles.prose}>
              Fits Nigeria Bond sleeve duration target; liquidity adequate for RFQ
              size under <span className={styles.mono}>₦250M</span>. Watch roll-down
              vs NTB ladder next auction.
            </p>
          </Panel>
        </div>
      </div>
    </>
  )
}
