/**
 * CHD RAG helpers (Node). Uses OpenAI embeddings + Supabase pgvector via service role.
 */
import { createClient } from '@supabase/supabase-js'

/** Paragraph-ish chunks with overlap for retrieval. */
export function chunkText(text, maxLen = 1800, overlap = 220) {
  const t = String(text).replace(/\r\n/g, '\n').trim()
  if (!t) return []
  const chunks = []
  let i = 0
  while (i < t.length) {
    const end = Math.min(i + maxLen, t.length)
    let slice = t.slice(i, end)
    if (end < t.length) {
      const lb = slice.lastIndexOf('\n\n')
      if (lb > maxLen * 0.35) slice = slice.slice(0, lb).trim()
    }
    const trimmed = slice.trim()
    if (trimmed.length > 40) chunks.push(trimmed)
    const step = Math.max(trimmed.length - overlap, Math.min(maxLen, 400))
    i += step
    if (i >= t.length) break
  }
  return chunks.length ? chunks : [t.slice(0, maxLen)]
}

export async function openaiEmbedBatch(apiKey, inputs) {
  const r = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: inputs,
    }),
  })
  const raw = await r.text()
  let data
  try {
    data = raw ? JSON.parse(raw) : {}
  } catch {
    throw new Error('OpenAI embeddings: invalid JSON')
  }
  if (!r.ok) {
    throw new Error(data.error?.message || `OpenAI embeddings HTTP ${r.status}`)
  }
  const list = (data.data || []).slice().sort((a, b) => a.index - b.index)
  return list.map((x) => x.embedding)
}

export function getSupabaseServiceClient() {
  const url = String(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  ).replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!url || !key) return null
  return createClient(url, key)
}

const RAG_ARCHIVE_BUCKET = 'chd-rag-archives'

/**
 * Best-effort PDF archive in Supabase Storage (requires bucket migration).
 * Returns { path } or { error: string } — ingest should continue if this fails.
 */
export async function archiveRagPdfBuffer(sb, objectPath, buffer) {
  const { data, error } = await sb.storage
    .from(RAG_ARCHIVE_BUCKET)
    .upload(objectPath, buffer, {
      contentType: 'application/pdf',
      upsert: false,
    })
  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true, path: data?.path ?? objectPath }
}

export async function deleteSourceChunks(sb, sourceLabel) {
  const { error } = await sb.from('chd_rag_chunks').delete().eq('source_label', sourceLabel)
  if (error) throw new Error(error.message)
}

export async function insertChunks(sb, rows) {
  const { error } = await sb.from('chd_rag_chunks').insert(rows)
  if (error) throw new Error(error.message)
}

export async function matchChunks(sb, queryEmbedding, matchCount = 8) {
  const { data, error } = await sb.rpc('match_chd_rag_chunks', {
    query_embedding: queryEmbedding,
    match_count: matchCount,
    min_similarity: 0.18,
  })
  if (error) throw new Error(error.message)
  return data || []
}

export async function openaiChat(apiKey, model, messages) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages }),
  })
  const raw = await r.text()
  let data
  try {
    data = raw ? JSON.parse(raw) : {}
  } catch {
    data = {}
  }
  if (!r.ok) {
    throw new Error(data.error?.message || `OpenAI chat HTTP ${r.status}`)
  }
  return {
    text: data?.choices?.[0]?.message?.content ?? '',
    model: data?.model ?? model,
  }
}
