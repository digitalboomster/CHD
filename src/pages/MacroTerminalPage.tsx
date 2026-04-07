import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  COMMODITY_DATA,
  FISCAL_DATA,
  FX_DATA,
  MACRO_BRIEFING,
  MACRO_TABS,
  MPR_HISTORY,
  type MacroTabId,
} from '../data/macroTerminal'
import styles from './MacroTerminalPage.module.css'

export function MacroTerminalPage() {
  const [tab, setTab] = useState<MacroTabId>('monetary')

  return (
    <>
      <h1 className={styles.pageTitle}>Macro data terminal</h1>
      <p className={styles.pageSub}>
        Consolidated Nigeria macro views — CBN, budget, FX, and commodity inputs
        feeding the regime engine and risk committees.
      </p>

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.tabs} role="tablist" aria-label="Macro categories">
            {MACRO_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.body} role="tabpanel">
            {tab === 'monetary' && (
              <>
                <div className={styles.chartBox} style={{ minHeight: 280 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={[...MPR_HISTORY]}>
                      <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="m"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        axisLine={{ stroke: '#30363d' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#161b22',
                          border: '1px solid #30363d',
                          borderRadius: 8,
                          fontFamily: 'IBM Plex Mono, monospace',
                          fontSize: 12,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="v"
                        name="MPR"
                        stroke="#c9a84c"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#c9a84c' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Indicator</th>
                      <th>Latest</th>
                      <th>Prior</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>MPR</td>
                      <td>27.50%</td>
                      <td>27.50%</td>
                    </tr>
                    <tr>
                      <td>CRR (avg.)</td>
                      <td>45.0%</td>
                      <td>45.0%</td>
                    </tr>
                    <tr>
                      <td>FX reserves (bn USD)</td>
                      <td>40.2</td>
                      <td>39.8</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {tab === 'fiscal' && (
              <>
                <div className={styles.chartBox} style={{ minHeight: 280 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[...FISCAL_DATA]}>
                      <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="m"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        axisLine={{ stroke: '#30363d' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#161b22',
                          border: '1px solid #30363d',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="oil" name="Oil revenue index" fill="#58a6ff" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="nonOil" name="Non-oil index" fill="#3fb950" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>2026 est.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Budget oil benchmark (USD/bbl)</td>
                      <td>75.0</td>
                    </tr>
                    <tr>
                      <td>Projected FGN deficit / GDP</td>
                      <td>4.2%</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {tab === 'fx' && (
              <>
                <div className={styles.chartBox} style={{ minHeight: 280 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={[...FX_DATA]}>
                      <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="m"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        axisLine={{ stroke: '#30363d' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#161b22',
                          border: '1px solid #30363d',
                          borderRadius: 8,
                          fontFamily: 'IBM Plex Mono, monospace',
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line
                        type="monotone"
                        dataKey="official"
                        name="Official (₦/$)"
                        stroke="#c9a84c"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="parallel"
                        name="Parallel (₦/$)"
                        stroke="#f85149"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Pair</th>
                      <th>Spot</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>NGN/USD (official)</td>
                      <td>1,583</td>
                    </tr>
                    <tr>
                      <td>Spread vs parallel (bps)</td>
                      <td>~680</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {tab === 'commodities' && (
              <>
                <div className={styles.chartBox} style={{ minHeight: 280 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={[...COMMODITY_DATA]}>
                      <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="d"
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        axisLine={{ stroke: '#30363d' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#8b949e', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#161b22',
                          border: '1px solid #30363d',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line
                        type="monotone"
                        dataKey="brent"
                        name="Brent (USD)"
                        stroke="#58a6ff"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="bonny"
                        name="Bonny Light"
                        stroke="#3fb950"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Spot</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>PMS (pump, Lagos)</td>
                      <td>₦935/l</td>
                    </tr>
                    <tr>
                      <td>Brent</td>
                      <td>$74.20</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>

        <aside className={styles.side}>
          <h2 className={styles.sideTitle}>Weekly macro briefing</h2>
          <ul className={styles.bullets}>
            {MACRO_BRIEFING.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className={styles.meta}>
            Narrative is illustrative; production copy is generated and compliance-reviewed
            (Phase 2+).
          </p>
        </aside>
      </div>
    </>
  )
}
