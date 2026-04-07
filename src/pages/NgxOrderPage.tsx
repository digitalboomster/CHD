import { useState } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FUNDS } from '../data/mock'
import styles from './NgxOrderPage.module.css'

const SPARK = [
  { d: '1', p: 478 },
  { d: '2', p: 481 },
  { d: '3', p: 479 },
  { d: '4', p: 482 },
  { d: '5', p: 484.2 },
]

const ORDER_TYPES = ['Market', 'Limit', 'VWAP', 'TWAP'] as const

export function NgxOrderPage() {
  const [orderType, setOrderType] = useState<(typeof ORDER_TYPES)[number]>('Limit')
  const [qty, setQty] = useState('12400')
  const [limitPx, setLimitPx] = useState('485.00')
  const [duration, setDuration] = useState<'day' | 'gtc'>('day')

  return (
    <>
      <h1 className={styles.pageTitle}>NGX order entry</h1>
      <p className={styles.pageSub}>
        Paramount Equity Fund — ticket capture with live strip, order type, and
        pre-trade context (prototype).
      </p>

      <div className={styles.layout}>
        <div className={styles.card}>
          <div className={styles.priceLabel}>Symbol</div>
          <div className={styles.ticker}>DANGCEM</div>
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>Last</span>
            <span>₦484.20</span>
          </div>
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>Bid / Ask</span>
            <span>484.10 / 484.35</span>
          </div>
          <div className={styles.range}>
            Day range: ₦478.00 — ₦486.50 · 15d ADV ≈ 4.02M sh
          </div>
          <div className={styles.spark} style={{ minHeight: 100 }}>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={SPARK}>
                <defs>
                  <linearGradient id="ngxFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9a84c" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip
                  contentStyle={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    fontSize: 11,
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="p"
                  stroke="#c9a84c"
                  fill="url(#ngxFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.formTitle}>Order</div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="fund-ngx">
              Fund
            </label>
            <select id="fund-ngx" className={styles.select} defaultValue="paramount">
              {FUNDS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Order type</span>
            <div className={styles.toggleRow} role="group" aria-label="Order type">
              {ORDER_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.typeBtn} ${orderType === t ? styles.typeActive : ''}`}
                  onClick={() => setOrderType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="qty">
                Quantity
              </label>
              <input
                id="qty"
                className={styles.input}
                value={qty}
                onChange={(e) => setQty(e.target.value.replace(/[^\d]/g, ''))}
                inputMode="numeric"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="limit">
                Limit (₦)
              </label>
              <input
                id="limit"
                className={styles.input}
                value={limitPx}
                onChange={(e) => setLimitPx(e.target.value)}
                disabled={orderType === 'Market' || orderType === 'VWAP'}
              />
            </div>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Duration</span>
            <div className={styles.toggleRow}>
              <button
                type="button"
                className={`${styles.typeBtn} ${duration === 'day' ? styles.typeActive : ''}`}
                onClick={() => setDuration('day')}
              >
                Day
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${duration === 'gtc' ? styles.typeActive : ''}`}
                onClick={() => setDuration('gtc')}
              >
                GTC
              </button>
            </div>
          </div>
          <div className={styles.impactLine}>
            Est. notional ₦{((Number(qty || 0) * 484.2) / 1e6).toFixed(2)}M · vs
            limit {limitPx} · {orderType}
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.btnPri}>
              Execute…
            </button>
            <button type="button" className={styles.btnSec}>
              Save draft
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.sideBlock}>
            <div className={styles.sideTitle}>Position (post-trade est.)</div>
            <div className={styles.sideVal}>7.4% of fund NAV</div>
          </div>
          <div className={styles.sideBlock}>
            <div className={styles.sideTitle}>Participation</div>
            <div className={styles.sideVal}>~0.31% of 15d ADV</div>
          </div>
          <div className={styles.ai}>
            <strong>Impact estimate:</strong> ~0.3% implementation shortfall vs
            arrival mid under current depth (mock). Route: DMA NGX · pre-trade
            mandate check required before release.
          </div>
        </div>
      </div>
    </>
  )
}
