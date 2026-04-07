/**
 * Minimal static responses matching `openapi/openapi.yaml`.
 * Run: `node server/mock-api.mjs` then set VITE_API_BASE_URL=http://localhost:8080
 *
 * Optional `.env.local` in project root: NGX_PULSE_API_KEY, OPENAI_API_KEY (never commit).
 */
import http from 'node:http'
import { handleRagPdfUpload } from './handle-rag-pdf-upload.mjs'
import { loadEnvLocal } from './load-env.mjs'
import {
  chunkText,
  deleteSourceChunks,
  getSupabaseServiceClient,
  insertChunks,
  matchChunks,
  openaiChat,
  openaiEmbedBatch,
} from './rag.mjs'

const PORT = Number(process.env.PORT || 8080)

loadEnvLocal()

const NGX_BASE = process.env.NGX_PULSE_BASE_URL || 'https://www.ngxpulse.ng'

async function fetchJson(url, headers) {
  const r = await fetch(url, { headers })
  const text = await r.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }
  return { ok: r.ok, status: r.status, data }
}

/** Merge live NGX ASI (and optional top gainer) with static macro strip rows. */
async function buildTickerResponse() {
  const key = process.env.NGX_PULSE_API_KEY
  const items = ticker.items.map((row) => ({ ...row }))

  if (!key) {
    return { items, source: 'mock' }
  }

  try {
    const { ok, data: m } = await fetchJson(`${NGX_BASE}/api/ngxdata/market`, {
      Accept: 'application/json',
      'X-API-Key': key,
    })
    if (!ok || m?.error) {
      return { items, source: 'mock', note: 'ngx_pulse_unavailable' }
    }

    if (typeof m.asi === 'number') {
      const pct = Number(m.pct_change)
      const dir =
        pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral'
      items[0] = {
        label: 'NGX ASI',
        value: m.asi.toLocaleString('en-NG', { maximumFractionDigits: 2 }),
        changeText: `${pct >= 0 ? '+' : ''}${Number.isFinite(pct) ? pct.toFixed(2) : m.pct_change}%`,
        direction: dir,
      }
    }

    const g = Array.isArray(m.gainers) ? m.gainers[0] : null
    if (g && (g.symbol || g.name)) {
      const sym = g.symbol || 'Top'
      const price = g.current_price ?? g.price
      const chg = g.change_percent ?? g.pct_change
      items[1] = {
        label: `${sym} (top gainer)`,
        value:
          typeof price === 'number'
            ? price.toLocaleString('en-NG', { maximumFractionDigits: 2 })
            : String(price ?? '—'),
        changeText:
          typeof chg === 'number'
            ? `${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%`
            : String(chg ?? '—'),
        direction:
          typeof chg === 'number'
            ? chg > 0
              ? 'up'
              : chg < 0
                ? 'down'
                : 'neutral'
            : 'neutral',
      }
    }

    return { items, source: 'ngx_pulse' }
  } catch {
    return { items, source: 'mock', note: 'ngx_pulse_error' }
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let buf = ''
    req.on('data', (c) => {
      buf += c
      if (buf.length > 1_000_000) {
        reject(new Error('body_too_large'))
      }
    })
    req.on('end', () => {
      try {
        resolve(buf ? JSON.parse(buf) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  })
  res.end(JSON.stringify(body))
}

const funds = {
  funds: [
    {
      id: 'mmf',
      name: 'CHD Money Market',
      mandate: 'Liquid / Short-term IG',
      benchmark: '91D NTB',
      nav: 1.0245,
      navChange: 0.02,
      ytd: 18.2,
      status: 'in',
    },
    {
      id: 'paramount',
      name: 'Paramount Equity',
      mandate: 'Nigerian Equities',
      benchmark: 'NGX 30',
      nav: 4.812,
      navChange: 0.41,
      ytd: 12.4,
      status: 'in',
    },
    {
      id: 'bond',
      name: 'Nigeria Bond',
      mandate: 'FGN Fixed Income',
      benchmark: 'FMDQ Bond Index',
      nav: 2.156,
      navChange: 0.08,
      ytd: 9.1,
      status: 'watch',
    },
    {
      id: 'dollar',
      name: 'Nigeria Dollar Income',
      mandate: 'USD Eurobond',
      benchmark: 'JPM EMBI Nigeria',
      nav: 1.089,
      navChange: -0.12,
      ytd: 6.8,
      status: 'in',
    },
    {
      id: 'nidf',
      name: 'NIDF',
      mandate: 'Infrastructure Debt',
      benchmark: 'Composite yield',
      nav: 108.2,
      navChange: 0.05,
      ytd: 8.9,
      status: 'in',
    },
    {
      id: 'women',
      name: "Women's Balanced",
      mandate: 'Multi-asset / ESG',
      benchmark: 'Blended 60/40',
      nav: 1.342,
      navChange: 0.15,
      ytd: 11.0,
      status: 'in',
    },
    {
      id: 'reit',
      name: 'Nigeria REIT',
      mandate: 'Real Estate',
      benchmark: 'NGX REIT Index',
      nav: 0.987,
      navChange: -0.03,
      ytd: 4.2,
      status: 'in',
    },
  ],
}

const ticker = {
  items: [
    { label: 'NGX ASI', value: '104,562', changeText: '+0.83%', direction: 'up' },
    { label: 'NGX 30', value: '3,841', changeText: '+1.12%', direction: 'up' },
    { label: '91D NTB', value: '23.41%', changeText: 'Unchanged', direction: 'neutral' },
    { label: 'CBN MPR', value: '27.50%', changeText: 'Unchanged', direction: 'neutral' },
    { label: 'NGN/USD', value: '1,583', changeText: '+0.4%', direction: 'down' },
    { label: 'Brent', value: '$74.20', changeText: '-1.2%', direction: 'down' },
    { label: 'CPI', value: '34.80%', changeText: 'Elevated', direction: 'neutral' },
    { label: 'FGN 10Y', value: '19.85%', changeText: '+12 bps', direction: 'down' },
  ],
}

const performance = {
  points: [
    { m: 'May', paramount: 100, bond: 100, mmf: 100, asi: 100, ntb: 100 },
    { m: 'Jun', paramount: 101.2, bond: 100.4, mmf: 100.5, asi: 100.8, ntb: 100.3 },
    { m: 'Jul', paramount: 103.1, bond: 101.0, mmf: 101.0, asi: 101.5, ntb: 100.6 },
    { m: 'Aug', paramount: 102.4, bond: 101.8, mmf: 101.4, asi: 100.9, ntb: 100.8 },
    { m: 'Sep', paramount: 105.0, bond: 102.2, mmf: 101.9, asi: 102.8, ntb: 101.0 },
    { m: 'Oct', paramount: 106.8, bond: 102.9, mmf: 102.3, asi: 103.4, ntb: 101.2 },
    { m: 'Nov', paramount: 108.2, bond: 103.5, mmf: 102.8, asi: 104.1, ntb: 101.4 },
    { m: 'Dec', paramount: 109.5, bond: 104.0, mmf: 103.2, asi: 104.8, ntb: 101.5 },
    { m: 'Jan', paramount: 110.1, bond: 104.6, mmf: 103.6, asi: 105.2, ntb: 101.7 },
    { m: 'Feb', paramount: 111.4, bond: 105.1, mmf: 104.0, asi: 105.9, ntb: 101.9 },
    { m: 'Mar', paramount: 112.8, bond: 105.8, mmf: 104.5, asi: 106.5, ntb: 102.1 },
    { m: 'Apr', paramount: 114.2, bond: 106.2, mmf: 104.9, asi: 107.0, ntb: 102.2 },
  ],
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    })
    res.end()
    return
  }

  const url = req.url?.split('?')[0] ?? ''

  if (req.method === 'POST' && url === '/v1/rag/ingest') {
    const openai = process.env.OPENAI_API_KEY
    const sb = getSupabaseServiceClient()
    if (!openai || !sb) {
      json(res, 503, {
        error: 'rag_misconfigured',
        message:
          'Set OPENAI_API_KEY, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_URL or VITE_SUPABASE_URL in .env.local.',
      })
      return
    }
    ;(async () => {
      try {
        const body = await readJsonBody(req)
        const text = typeof body.text === 'string' ? body.text : ''
        const sourceLabel =
          typeof body.source_label === 'string' && body.source_label.trim()
            ? body.source_label.trim()
            : 'ingest'
        if (!text.trim()) {
          json(res, 400, { error: 'bad_request', message: 'Missing text' })
          return
        }
        const replace = body.replace !== false
        const parts = chunkText(text)
        if (replace) await deleteSourceChunks(sb, sourceLabel)
        const batch = 16
        for (let i = 0; i < parts.length; i += batch) {
          const slice = parts.slice(i, i + batch)
          const emb = await openaiEmbedBatch(openai, slice)
          const rows = slice.map((content, j) => ({
            source_label: sourceLabel,
            chunk_index: i + j,
            content,
            embedding: emb[j],
          }))
          await insertChunks(sb, rows)
        }
        json(res, 200, {
          ok: true,
          source_label: sourceLabel,
          chunks: parts.length,
        })
      } catch (e) {
        json(res, 500, {
          error: 'ingest_failed',
          message: e instanceof Error ? e.message : String(e),
        })
      }
    })()
    return
  }

  if (req.method === 'POST' && url === '/v1/rag/upload-pdf') {
    const openai = process.env.OPENAI_API_KEY
    ;(async () => {
      try {
        const out = await handleRagPdfUpload(req, openai)
        json(res, out.status, out.body)
      } catch (e) {
        json(res, 500, {
          error: 'pdf_upload_failed',
          message: e instanceof Error ? e.message : String(e),
        })
      }
    })()
    return
  }

  if (req.method === 'POST' && url === '/v1/rag/chat') {
    const openai = process.env.OPENAI_API_KEY
    const sb = getSupabaseServiceClient()
    if (!openai || !sb) {
      json(res, 503, {
        error: 'rag_misconfigured',
        message:
          'Set OPENAI_API_KEY, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_URL or VITE_SUPABASE_URL in .env.local.',
      })
      return
    }
    ;(async () => {
      try {
        const body = await readJsonBody(req)
        const prompt =
          typeof body.prompt === 'string'
            ? body.prompt
            : typeof body.message === 'string'
              ? body.message
              : ''
        if (!prompt.trim()) {
          json(res, 400, { error: 'bad_request', message: 'Missing prompt or message' })
          return
        }
        const [qEmb] = await openaiEmbedBatch(openai, [prompt.trim()])
        const hits = await matchChunks(sb, qEmb, Number(body.match_count) || 8)
        const ctx = hits.length
          ? hits
              .map(
                (h, idx) =>
                  `[${idx + 1}] (${h.source_label} #${h.chunk_index})\n${h.content}`,
              )
              .join('\n\n---\n\n')
          : '(No matching passages in the CHD knowledge base for this query.)'
        const fund =
          typeof body.active_fund === 'string' ? body.active_fund : 'All funds'
        const model = typeof body.model === 'string' ? body.model : 'gpt-4o-mini'
        const userBlock = `Active fund context (UI): ${fund}\n\nUser question: ${prompt.trim()}`
        const system = `You are CHD Co-pilot, an assistant inside the CHD Nigerian asset-management quant terminal.

Use the retrieved passages below to support factual claims about CHD product scope, workflows, screens, and mandate behaviour. If they do not contain the answer, say the knowledge base does not cover it and suggest what to verify next. You may add general market context only when clearly labeled as general (not CHD-specific).

When a fact comes from a passage, cite it with [n] matching the bracket number.

RETRIEVED PASSAGES:
${ctx}`

        const { text, model: usedModel } = await openaiChat(openai, model, [
          { role: 'system', content: system },
          { role: 'user', content: userBlock },
        ])

        json(res, 200, {
          text,
          model: usedModel,
          mode: 'rag',
          sources: hits.map((h, idx) => ({
            rank: idx + 1,
            source_label: h.source_label,
            chunk_index: h.chunk_index,
            similarity: h.similarity,
            snippet:
              h.content.slice(0, 200) + (h.content.length > 200 ? '…' : ''),
          })),
        })
      } catch (e) {
        json(res, 500, {
          error: 'rag_chat_failed',
          message: e instanceof Error ? e.message : String(e),
        })
      }
    })()
    return
  }

  if (req.method === 'POST' && url === '/v1/copilot/chat') {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      json(res, 503, {
        error: 'openai_not_configured',
        message: 'Set OPENAI_API_KEY in .env.local for the mock API server.',
      })
      return
    }
    ;(async () => {
      try {
        const body = await readJsonBody(req)
        const prompt =
          typeof body.prompt === 'string'
            ? body.prompt
            : typeof body.message === 'string'
              ? body.message
              : ''
        if (!prompt.trim()) {
          json(res, 400, { error: 'bad_request', message: 'Missing prompt or message' })
          return
        }
        const model = body.model || 'gpt-4o-mini'
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content:
                  'You are CHD Co-pilot: concise assistant for a Nigerian asset-management quant terminal (NGX, bonds, mandates). Use NGN where relevant. If unsure, say so.',
              },
              { role: 'user', content: prompt.trim() },
            ],
          }),
        })
        const raw = await r.text()
        let data
        try {
          data = raw ? JSON.parse(raw) : {}
        } catch {
          data = { raw }
        }
        if (!r.ok) {
          json(res, 502, {
            error: 'openai_error',
            status: r.status,
            detail: data,
          })
          return
        }
        const text = data?.choices?.[0]?.message?.content ?? ''
        json(res, 200, { text, model: data?.model ?? model })
      } catch (e) {
        json(res, 500, {
          error: 'server_error',
          message: e instanceof Error ? e.message : String(e),
        })
      }
    })()
    return
  }

  if (req.method === 'GET' && url === '/v1/health') {
    json(res, 200, { status: 'ok', version: '0.1.0-mock' })
    return
  }
  if (req.method === 'GET' && url === '/v1/funds') {
    json(res, 200, funds)
    return
  }
  if (req.method === 'GET' && url === '/v1/market/ticker') {
    ;(async () => {
      const payload = await buildTickerResponse()
      json(res, 200, payload)
    })()
    return
  }
  if (req.method === 'GET' && url === '/v1/market/performance') {
    json(res, 200, performance)
    return
  }

  json(res, 404, { error: 'not_found', message: url })
})

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use (another mock:api or app is running).`,
    )
    console.error(`  Fix: lsof -i :${PORT}  →  kill <PID>`)
    console.error(
      `  Or use another port: PORT=8081 node server/mock-api.mjs  and set VITE_API_BASE_URL=http://localhost:8081`,
    )
  } else {
    console.error(err)
  }
  process.exit(1)
})

server.listen(PORT, () => {
  console.log(`CHD mock API at http://localhost:${PORT} (OpenAPI v1 paths)`)
})
