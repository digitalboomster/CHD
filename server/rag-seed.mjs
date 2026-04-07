/**
 * One-shot: chunk + embed + insert `rag/chd-context.md` into Supabase.
 * Requires OPENAI_API_KEY, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL (or SUPABASE_URL).
 *
 *   node server/rag-seed.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnvLocal } from './load-env.mjs'
import {
  chunkText,
  deleteSourceChunks,
  getSupabaseServiceClient,
  insertChunks,
  openaiEmbedBatch,
} from './rag.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SOURCE = 'chd-platform-context'

loadEnvLocal(resolve(__dirname, '..'))

const openai = process.env.OPENAI_API_KEY
const sb = getSupabaseServiceClient()

if (!openai || !sb) {
  console.error(
    'Missing OPENAI_API_KEY and/or Supabase service client (SUPABASE_SERVICE_ROLE_KEY + URL).',
  )
  process.exit(1)
}

const mdPath = resolve(__dirname, '../rag/chd-context.md')
const text = readFileSync(mdPath, 'utf8')
const parts = chunkText(text)

console.log(`Seeding ${parts.length} chunks from ${mdPath} as "${SOURCE}"…`)

await deleteSourceChunks(sb, SOURCE)

const batch = 16
for (let i = 0; i < parts.length; i += batch) {
  const slice = parts.slice(i, i + batch)
  const emb = await openaiEmbedBatch(openai, slice)
  const rows = slice.map((content, j) => ({
    source_label: SOURCE,
    chunk_index: i + j,
    content,
    embedding: emb[j],
  }))
  await insertChunks(sb, rows)
  process.stdout.write('.')
}

console.log('\nDone.')
