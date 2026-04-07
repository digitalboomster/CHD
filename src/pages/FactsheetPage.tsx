import { useState } from 'react'
import { FUNDS } from '../data/mock'
import { Panel } from '../components/Panel'
import styles from './ReportPages.module.css'

export function FactsheetPage() {
  const [fund, setFund] = useState('paramount')
  const [period, setPeriod] = useState('2026-03')
  const [commentary, setCommentary] = useState('')

  return (
    <>
      <h1 className={styles.pageTitle}>Factsheet generation</h1>
      <p className={styles.pageSub}>
        Month-end pack — live data hooks + Gemini narrative (stub preview).
      </p>
      <div className={styles.grid2}>
        <div className={styles.stack}>
          <Panel title="Parameters" subtitle="Fund &amp; period">
            <div style={{ marginBottom: 16 }}>
              <label className={styles.statLabel} htmlFor="fs-fund">
                Fund
              </label>
              <select
                id="fs-fund"
                className={styles.mono}
                style={{
                  width: '100%',
                  marginTop: 8,
                  minHeight: 40,
                  background: 'var(--chd-surface-input)',
                  border: '1px solid var(--chd-border)',
                  borderRadius: 6,
                  color: 'var(--chd-text)',
                  padding: '0 12px',
                }}
                value={fund}
                onChange={(e) => setFund(e.target.value)}
              >
                {FUNDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.statLabel} htmlFor="fs-period">
                Period
              </label>
              <input
                id="fs-period"
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 8,
                  minHeight: 40,
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid var(--chd-border)',
                  background: 'var(--chd-surface-input)',
                  color: 'var(--chd-text)',
                }}
              />
            </div>
          </Panel>
          <Panel title="AI commentary" subtitle="Edit before compliance">
            <button type="button" className={styles.btnOutline} style={{ marginBottom: 12 }}>
              Generate commentary…
            </button>
            <textarea
              value={commentary}
              onChange={(e) => setCommentary(e.target.value)}
              placeholder="Three-paragraph investment narrative appears here…"
              rows={10}
              style={{
                width: '100%',
                resize: 'vertical',
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--chd-border)',
                background: 'var(--chd-surface-input)',
                color: 'var(--chd-text)',
                fontSize: 13,
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <button type="button" className={styles.btnGold}>
                Generate &amp; publish…
              </button>
              <button type="button" className={styles.btnOutline}>
                Send to Compliance
              </button>
            </div>
          </Panel>
        </div>
        <Panel title="Preview" subtitle="PDF layout (mock)">
          <div
            style={{
              minHeight: 420,
              border: '1px dashed var(--chd-border)',
              borderRadius: 8,
              padding: 24,
              background: 'var(--chd-surface)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, marginBottom: 8 }}>
              {FUNDS.find((f) => f.id === fund)?.name ?? 'Fund'}
            </div>
            <div className={styles.mono} style={{ fontSize: 12, color: 'var(--chd-text-muted)' }}>
              Period {period} · NAV chart · benchmark · top 10 · risk stats
            </div>
            <div
              style={{
                marginTop: 24,
                height: 120,
                background: 'var(--chd-surface-overlay)',
                borderRadius: 6,
                display: 'grid',
                placeItems: 'center',
                color: 'var(--chd-text-dim)',
                fontSize: 12,
              }}
            >
              Chart placeholder
            </div>
            <table className={styles.table} style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Holding</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DANGCEM</td>
                  <td>6.8%</td>
                </tr>
                <tr>
                  <td>GTCO</td>
                  <td>5.9%</td>
                </tr>
                <tr>
                  <td>MTNN</td>
                  <td>5.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  )
}
