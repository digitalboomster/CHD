import { readFile, unlink } from 'node:fs/promises'
import { createRequire } from 'node:module'
import formidable from 'formidable'
import {
  archiveRagPdfBuffer,
  chunkText,
  getSupabaseServiceClient,
  insertChunks,
  openaiEmbedBatch,
} from './rag.mjs'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

/**
 * Multipart field "file" (PDF). Optional field "source_label" for naming.
 */
export async function handleRagPdfUpload(req, openaiKey) {
  const sb = getSupabaseServiceClient()
  if (!openaiKey || !sb) {
    return {
      status: 503,
      body: {
        error: 'rag_misconfigured',
        message:
          'Set OPENAI_API_KEY, SUPABASE_SERVICE_ROLE_KEY, and Supabase URL in .env.local.',
      },
    }
  }

  const form = formidable({
    maxFileSize: 20 * 1024 * 1024,
    allowEmptyFiles: false,
  })

  let fields
  let files
  try {
    ;[fields, files] = await form.parse(req)
  } catch (e) {
    return {
      status: 400,
      body: {
        error: 'multipart_parse',
        message: e instanceof Error ? e.message : String(e),
      },
    }
  }

  const uploaded = files.file?.[0] ?? files.pdf?.[0]
  if (!uploaded) {
    return {
      status: 400,
      body: {
        error: 'missing_file',
        message: 'Attach a PDF using form field "file".',
      },
    }
  }

  const buf = await readFile(uploaded.filepath)
  await unlink(uploaded.filepath).catch(() => {})

  let text
  try {
    const data = await pdfParse(buf)
    text = data.text
  } catch {
    return {
      status: 400,
      body: {
        error: 'pdf_parse',
        message: 'Could not parse PDF (encrypted or image-only?).',
      },
    }
  }

  if (!text || text.trim().length < 30) {
    return {
      status: 400,
      body: {
        error: 'empty_pdf',
        message: 'Almost no text extracted — try a text-based PDF.',
      },
    }
  }

  const name = (uploaded.originalFilename || 'document.pdf').trim()
  const rawLabel = (fields.source_label?.[0] || name).trim().slice(0, 160)
  const safe =
    rawLabel.replace(/[^\w\s.-]+/g, '_').replace(/\s+/g, '_').slice(0, 80) ||
    'document'
  const ts = Date.now()
  const sourceLabel = `pdf:${safe}:${ts}`

  const archiveName = `${ts}_${safe.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 72)}.pdf`
  const archivePath = `ingests/${archiveName}`
  const archiveResult = await archiveRagPdfBuffer(sb, archivePath, buf)

  const parts = chunkText(text)
  const batch = 16
  for (let i = 0; i < parts.length; i += batch) {
    const slice = parts.slice(i, i + batch)
    const emb = await openaiEmbedBatch(openaiKey, slice)
    const rows = slice.map((content, j) => ({
      source_label: sourceLabel,
      chunk_index: i + j,
      content,
      embedding: emb[j],
    }))
    await insertChunks(sb, rows)
  }

  return {
    status: 200,
    body: {
      ok: true,
      source_label: sourceLabel,
      chunks: parts.length,
      archived: archiveResult.ok,
      archive_path: archiveResult.ok ? archiveResult.path : undefined,
      archive_note: archiveResult.ok ? undefined : archiveResult.error,
    },
  }
}
