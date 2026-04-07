-- Context chunks + embeddings for CHD co-pilot (pgvector).
create extension if not exists vector;

create table if not exists public.chd_rag_chunks (
  id uuid primary key default gen_random_uuid(),
  source_label text not null,
  chunk_index int not null,
  content text not null,
  embedding vector(1536) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source_label, chunk_index)
);

create index if not exists chd_rag_chunks_embedding_idx
  on public.chd_rag_chunks
  using hnsw (embedding vector_cosine_ops);

alter table public.chd_rag_chunks enable row level security;

-- Only service role / direct DB writes ingest; clients never read raw table with anon key.

create or replace function public.match_chd_rag_chunks (
  query_embedding vector(1536),
  match_count int default 8,
  min_similarity double precision default 0.2
)
returns table (
  id uuid,
  content text,
  source_label text,
  chunk_index int,
  similarity float
)
language sql
stable
as $$
  select
    c.id,
    c.content,
    c.source_label,
    c.chunk_index,
    (1 - (c.embedding <=> query_embedding))::float as similarity
  from public.chd_rag_chunks c
  where 1 - (c.embedding <=> query_embedding) >= min_similarity
  order by c.embedding <=> query_embedding
  limit least(coalesce(match_count, 8), 32);
$$;

comment on table public.chd_rag_chunks is 'RAG chunks for CHD co-pilot; embedded with text-embedding-3-small (1536d).';

-- Service role invokes RPC from the CHD mock API (server-side only).
grant execute on function public.match_chd_rag_chunks(vector(1536), integer, double precision) to service_role;
