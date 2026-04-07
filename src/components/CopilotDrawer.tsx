import { useCallback, useEffect, useRef, useState } from 'react'
import { getApiBaseUrl } from '../api/config'
import styles from './CopilotDrawer.module.css'

type Source = {
  rank: number
  source_label: string
  chunk_index: number
  similarity: number
  snippet: string
}

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
  mode?: 'rag' | 'plain'
  sources?: Source[]
}

type CopilotDrawerProps = {
  open: boolean
  onClose: () => void
  activeFundLabel: string
}

function describeApiError(
  r: Response,
  data: { message?: unknown; error?: unknown },
): string {
  const msg = typeof data.message === 'string' ? data.message : ''
  const err = typeof data.error === 'string' ? data.error : ''
  if (
    r.status === 404 &&
    (msg.startsWith('/v1/') || err === 'not_found')
  ) {
    return 'The CHD API on port 8080 is missing that route or not running. Open a second Terminal, run npm run mock:api, leave it running, then try Send again.'
  }
  return msg || err || `HTTP ${r.status}`
}

export function CopilotDrawer({
  open,
  onClose,
  activeFundLabel,
}: CopilotDrawerProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Ask about CHD screens, mandates, or Nigerian market workflows. With the dev API running and RAG seeded, answers cite numbered sources from your knowledge base.',
      mode: 'rag',
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [open, messages, loading])

  const send = useCallback(async () => {
    const q = input.trim()
    if (!q || loading) return

    const base = getApiBaseUrl()
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setLoading(true)

    if (!base) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'Set VITE_API_BASE_URL (e.g. http://localhost:8080) and run the mock API so Co-pilot can reach OpenAI and RAG.',
          mode: 'plain',
        },
      ])
      setLoading(false)
      return
    }

    try {
      let r = await fetch(`${base}/v1/rag/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          active_fund: activeFundLabel,
        }),
      })

      let data: {
        text?: string
        sources?: Source[]
        mode?: string
        error?: string
        message?: string
      } = {}
      try {
        data = await r.json()
      } catch {
        data = {}
      }

      if (r.status === 503 && data.error === 'rag_misconfigured') {
        r = await fetch(`${base}/v1/copilot/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: q }),
        })
        try {
          data = await r.json()
        } catch {
          data = {}
        }
        if (!r.ok) {
          throw new Error(describeApiError(r, data))
        }
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            text:
              data.text ||
              'No reply. Add SUPABASE_SERVICE_ROLE_KEY and run `npm run rag:seed`, or check OPENAI_API_KEY.',
            mode: 'plain',
          },
        ])
        setLoading(false)
        return
      }

      if (!r.ok) {
        throw new Error(describeApiError(r, data))
      }

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: data.text || '(empty response)',
          mode: 'rag',
          sources: data.sources,
        },
      ])
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e)
      const friendly =
        raw === 'Failed to fetch' ||
        raw.includes('Load failed') ||
        raw.includes('NetworkError')
          ? 'Cannot reach the API. In a separate terminal run npm run mock:api and keep it open (usually http://localhost:8080).'
          : `Something went wrong: ${raw}`
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: friendly,
          mode: 'plain',
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, activeFundLabel])

  return (
    <>
      <div
        className={styles.backdrop}
        data-open={open}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        id="chd-copilot-panel"
        className={styles.panel}
        data-open={open}
        aria-hidden={!open}
        aria-label="CHD Co-pilot"
      >
        <div className={styles.head}>
          <div>
            <div className={styles.headTitle}>CHD Co-pilot</div>
            <div className={styles.headMeta}>
              RAG + OpenAI · Active fund: {activeFundLabel}
            </div>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close co-pilot"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={`m-${i}`}
              className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}
            >
              <p className={styles.bubbleText}>{msg.text}</p>
              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 ? (
                <div className={styles.sources}>
                  <div className={styles.sourcesTitle}>Sources</div>
                  {msg.sources.map((s) => (
                    <div key={s.rank} className={styles.sourceRow}>
                      [{s.rank}] {s.source_label} #{s.chunk_index} ·{' '}
                      {(s.similarity * 100).toFixed(1)}% match
                      <div className={styles.sourceSnippet}>{s.snippet}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {loading ? (
            <div className={`${styles.bubble} ${styles.bubbleAi}`}>
              <p className={styles.bubbleText}>Thinking…</p>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>
        <form
          className={styles.composer}
          onSubmit={(e) => {
            e.preventDefault()
            void send()
          }}
        >
          <div className={styles.composerMain}>
            <button
              type="button"
              className={styles.toolBtn}
              aria-label="Voice input (coming soon)"
              title="Voice — not wired yet (Phase 2)."
              disabled
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M19 11a7 7 0 01-14 0M12 18v3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              className={styles.input}
              placeholder="Ask about mandates, trades, or macro…"
              aria-label="Co-pilot message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className={styles.send} disabled={loading}>
              Send
            </button>
          </div>
          <div className={styles.composerMeta}>
            <button
              type="button"
              className={styles.attachBtn}
              title="Attach trade context from blotter — Phase 2."
              disabled
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Attach trade</span>
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}
