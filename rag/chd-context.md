# CHD quant platform — internal context (RAG seed)

## Product

CHD is an AI-native quant and mandate platform for Nigerian asset management. The shell includes an executive dashboard, fund overview (including NIDF), macro regime views, equity and fixed-income signal screens, eurobond views, factor backtesting, mandate compliance, pre-trade checks, stress testing, VaR-style risk summaries, trade blotter, FMDQ RFQ workflow, NGX order entry, post-trade allocation, factsheet and IC-style reporting, ESG/impact views, macro terminal, security deep-dive, peer benchmarking, CBN MPC calendar, roles/permissions, and model configuration. Design language: near-black surfaces, gold accent, IBM Plex Mono / Playfair / DM Sans, trading-terminal density.

## Markets & session

Primary markets: NGX listed equities, Nigerian government bonds and money markets, FMDQ OTC fixed income, eurobond sleeve where mandated. Nigerian cash equity session is typically 10:00–14:30 WAT Monday–Friday excluding holidays. Market data for the ticker strip can be merged from NGX Pulse (ASI and breadth) while macro lines (MPR, NTB, FX) may remain curated snapshots until wired to official feeds.

## Mandates & risk (illustrative)

Funds in the prototype include money market, Paramount Equity (NGX), Nigeria Bond, dollar income, NIDF infrastructure debt, balanced, and REIT sleeves. Mandate monitoring uses traffic-light style status (in / watch / breach). Pre-trade checks validate sleeve limits, concentration, liquidity, and policy text before execution-style actions. Stress scenarios and VaR pages are analytical views; production would consume risk engine outputs.

## Execution (prototype)

Blotter lists trades for audit; RFQ path targets FMDQ-style negotiation; NGX order entry captures side, quantity, type, and broker slot. Nothing in the prototype sends live orders to a broker — it is a UX and data shell.

## Co-pilot behaviour

The co-pilot should prefer facts stated in retrieved CHD context and mandate excerpts. When context is insufficient, say so and suggest which desk or system owns the answer. Never present live prices or compliance decisions as certain unless sourced from wired data. Use NGN and Nigerian market conventions where relevant.

## Data sources (planned)

NGX Pulse can supply listed equity prices and market overview. Supabase stores RAG chunks and future auth-backed tables. OpenAI powers embeddings and chat on the server only; keys are not exposed to the browser.
