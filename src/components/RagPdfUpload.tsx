import { useCallback, useId, useRef, useState } from 'react'
import { getApiBaseUrl } from '../api/config'
import styles from './RagPdfUpload.module.css'

export function RagPdfUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const inputId = useId()

  const base = getApiBaseUrl()

  const onPick = useCallback(async () => {
    const input = inputRef.current
    const file = input?.files?.[0]
    if (!file || !base) return
    setBusy(true)
    setStatus(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('source_label', file.name.replace(/\.pdf$/i, ''))
      const r = await fetch(`${base}/v1/rag/upload-pdf`, {
        method: 'POST',
        body: fd,
      })
      const data = (await r.json().catch(() => ({}))) as {
        chunks?: number
        source_label?: string
        message?: string
        error?: string
        archived?: boolean
        archive_path?: string
        archive_note?: string
      }
      if (!r.ok) {
        setStatus(data.message || data.error || `Upload failed (${r.status})`)
        return
      }
      const parts = [
        `Indexed ${data.chunks ?? 0} chunks`,
        data.source_label ?? '',
        data.archived && data.archive_path
          ? `Stored: ${data.archive_path}`
          : data.archive_note
            ? `Archive: ${data.archive_note}`
            : '',
      ].filter(Boolean)
      setStatus(parts.join(' · '))
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(false)
      if (input) input.value = ''
    }
  }, [base])

  if (!base) return null

  return (
    <div className={styles.wrap}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="application/pdf,.pdf"
        className={styles.fileInput}
        onChange={() => void onPick()}
        disabled={busy}
        aria-label="Upload PDF into co-pilot knowledge base"
      />
      <label htmlFor={inputId} className={styles.label} title="Text-based PDFs only. Max ~20 MB.">
        <span className={styles.icon} aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.labelText}>{busy ? '…' : 'PDF'}</span>
      </label>
      {status ? (
        <span className={styles.hint} role="status" aria-live="polite">
          {status}
        </span>
      ) : null}
    </div>
  )
}
