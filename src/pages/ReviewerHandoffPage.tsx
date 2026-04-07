import { Panel } from '../components/Panel'
import styles from './ReviewerHandoffPage.module.css'

export function ReviewerHandoffPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>Reviewer handoff</h1>
      <p className={styles.pageSub}>
        This build is meant for <strong>orientation and technical review</strong> — not
        production trading. The strip under the top bar tells you whether the shell is
        using bundled prototype figures or your API. Individual widgets may still be
        static even when the API is live; the matrix below calls that out honestly.
      </p>

      <div className={styles.stack}>
        <Panel
          title="Quick start (local)"
          subtitle="What to run before the walkthrough makes sense"
        >
          <ol className={styles.ol}>
            <li>
              Install dependencies: <code>npm install</code> (use{' '}
              <code>--legacy-peer-deps</code> if npm complains about peers).
            </li>
            <li>
              Copy <code>.env.example</code> into <code>.env.local</code> and fill in
              optional keys — see the Environment panel.
            </li>
            <li>
              <strong>Terminal A:</strong> <code>npm run mock:api</code> (OpenAPI-shaped
              backend, usually port 8080).
            </li>
            <li>
              <strong>Terminal B:</strong>{' '}
              <code>VITE_API_BASE_URL=http://localhost:8080 npm run dev</code>
            </li>
            <li>
              Open the app URL (Vite prints it — typically port 5173). Use{' '}
              <strong>Tour</strong> in the header or <strong>Replay product tour</strong>{' '}
              in the sidebar if the guided steps do not appear automatically.
            </li>
          </ol>
        </Panel>

        <Panel
          title="Environment variables"
          subtitle="Browser-safe keys use the VITE_ prefix; secrets stay on the server"
        >
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>VITE_API_BASE_URL</code>
                  </td>
                  <td>
                    Points the UI at your HTTP API (e.g. mock API or Docker). Unset =
                    bundled prototype data only.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>VITE_DEV_API_PROXY</code>
                  </td>
                  <td>
                    Optional Vite dev proxy target when the UI uses a same-origin path
                    like <code>/api</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>VITE_SUPABASE_URL</code> + key
                  </td>
                  <td>
                    Enables top-bar sign-in (anon / publishable key only — never the
                    service role in Vite).
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>OPENAI_API_KEY</code>
                  </td>
                  <td>
                    Server only — powers Co-pilot chat when using{' '}
                    <code>npm run mock:api</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>SUPABASE_SERVICE_ROLE_KEY</code>
                  </td>
                  <td>
                    Server only — RAG ingest / PDF archive; not exposed to the browser.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.note}>
            Full notes and SQL migration hints live in <code>.env.example</code> in the
            repo root.
          </p>
        </Panel>

        <Panel
          title="Stub vs live — by area"
          subtitle="Honest labels for what reviewers should expect in this codebase"
        >
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Typical review build</th>
                  <th>Production direction</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Executive dashboard · KPIs · performance chart</td>
                  <td>
                    <span className={styles.pillRow}>
                      <span className={`${styles.pill} ${styles.pillMix}`}>
                        API or prototype
                      </span>
                    </span>
                    Uses funds + performance endpoints when configured; falls back to
                    bundled series.
                  </td>
                  <td>Wire to portfolio accounting / risk batch jobs.</td>
                </tr>
                <tr>
                  <td>Market ticker strip</td>
                  <td>
                    <span className={`${styles.pill} ${styles.pillMix}`}>API or mock</span>{' '}
                    NGX Pulse key optional on server for livelier tape.
                  </td>
                  <td>Replace with vendor or exchange real-time feed.</td>
                </tr>
                <tr>
                  <td>Co-pilot drawer</td>
                  <td>
                    <span className={`${styles.pill} ${styles.pillApi}`}>Needs API</span>{' '}
                    + OpenAI on server. Voice / attach marked Phase 2.
                  </td>
                  <td>Policy, logging, and model governance.</td>
                </tr>
                <tr>
                  <td>PDF → RAG</td>
                  <td>
                    <span className={`${styles.pill} ${styles.pillApi}`}>Server + DB</span>{' '}
                    Embeddings not queryable with anon key by design.
                  </td>
                  <td>Quota, retention, and access control on archives.</td>
                </tr>
                <tr>
                  <td>Signals · macro · research pages</td>
                  <td>
                    <span className={`${styles.pill} ${styles.pillProto}`}>
                      Mostly prototype
                    </span>{' '}
                    Copy and charts illustrate workflow; not live model output.
                  </td>
                  <td>Connect quant stack and data vendors.</td>
                </tr>
                <tr>
                  <td>Execution (NGX ticket · FMDQ RFQ · blotter)</td>
                  <td>
                    <span className={`${styles.pill} ${styles.pillProto}`}>UI stubs</span>{' '}
                    For workflow review only.
                  </td>
                  <td>OMS, broker FIX, and internal order state.</td>
                </tr>
                <tr>
                  <td>Compliance · stress · VaR views</td>
                  <td>
                    <span className={`${styles.pill} ${styles.pillProto}`}>
                      Illustrative
                    </span>{' '}
                    Mock breaches and scenarios unless you extend the API.
                  </td>
                  <td>Risk engine + mandate system of record.</td>
                </tr>
                <tr>
                  <td>Reporting (factsheet · IC · ESG)</td>
                  <td>
                    <span className={`${styles.pill} ${styles.pillProto}`}>
                      Stub / preview
                    </span>{' '}
                    Layout and narrative placeholders.
                  </td>
                  <td>Document generation pipeline and approvals.</td>
                </tr>
                <tr>
                  <td>Admin (roles · models)</td>
                  <td>
                    <span className={`${styles.pill} ${styles.pillProto}`}>Prototype</span>{' '}
                    Controls are non-destructive demos.
                  </td>
                  <td>IAM integration and config service.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Contract" subtitle="Machine-readable API description">
          <p className={styles.note} style={{ marginTop: 0 }}>
            The mock server implements routes described in{' '}
            <code>openapi/openapi.yaml</code>. Use it as the contract for swapping in a
            real backend.
          </p>
        </Panel>
      </div>
    </>
  )
}
