import type { NavigateFunction } from 'react-router-dom'
import type { Step } from 'react-joyride'

function waitRoute() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    setTimeout(resolve, 420)
  })
}

export function buildChdTourSteps(navigate: NavigateFunction): Step[] {
  const go = (path: string) => async () => {
    navigate(path)
    await waitRoute()
  }

  return [
    {
      target: 'body',
      placement: 'center',
      title: 'Welcome to CHD Quant',
      content: (
        <>
          <p>
            This guided tour walks through the shell and a few sample modules so
            reviewers can see how the workspace is organised.
          </p>
          <p>
            Figures may come from a bundled prototype or from your API — watch
            for the status strip under the top bar and banners on pages when live
            data is unavailable.
          </p>
        </>
      ),
      skipBeacon: true,
    },
    {
      target: '[data-tour="topbar-brand"]',
      title: 'Platform context',
      placement: 'bottom',
      content:
        'Brand and market scope (NGX · FMDQ). Click the title anytime to return to the executive dashboard.',
    },
    {
      target: '[data-tour="fund-select"]',
      title: 'Fund context',
      placement: 'bottom',
      content:
        'Charts, tables, and co-pilot answers use the fund you select here as default context.',
    },
    {
      target: '[data-tour="copilot-btn"]',
      title: 'Co-pilot',
      placement: 'bottom',
      content:
        'Opens the AI panel for mandate Q&A. When the mock API and OpenAI key are configured, it can use RAG over uploaded PDFs (embeddings stay server-side).',
    },
    {
      target: '[data-tour="account-tools"]',
      title: 'Account & documents',
      placement: 'bottom',
      content:
        'Sign in with Supabase when enabled, or use local mode for demos. The PDF control appears when an API base URL is set — uploads are processed by the backend, not the browser.',
    },
    {
      target: '[data-tour="sidebar-nav"]',
      title: 'Navigation',
      placement: 'right',
      content:
        'All product areas are grouped here: overview, signals, compliance, execution, reporting, research, and admin. Each route is a focused surface for review or future integration.',
    },
    {
      target: '[data-tour="ticker"]',
      title: 'Market strip',
      placement: 'bottom',
      content:
        'Rolling indicative levels for key Nigerian benchmarks — prototype or API-fed depending on setup.',
    },
    {
      target: '[data-tour="main-content"]',
      title: 'Main workspace',
      placement: 'left',
      content:
        'Page content loads here. Below is a sample path through compliance, execution, and reporting.',
    },
    {
      target: '[data-tour="main-content"]',
      title: 'Mandate monitor',
      placement: 'left',
      before: go('/compliance'),
      content:
        'Compliance routes summarise mandate limits and breaches. Wire this to your risk engine or OMS when moving beyond prototype.',
    },
    {
      target: '[data-tour="main-content"]',
      title: 'Execution — NGX ticket',
      placement: 'left',
      before: go('/trade/ngx'),
      content:
        'Order entry and routing screens are stubs for workflow review. Connect to NGX or broker FIX when you harden the stack.',
    },
    {
      target: '[data-tour="main-content"]',
      title: 'Reporting — factsheets',
      placement: 'left',
      before: go('/reports/factsheet'),
      content:
        'Report builders preview month-end and IC-style outputs. Narrative and live PDF generation hook to your data and doc pipeline later.',
    },
    {
      target: 'body',
      placement: 'center',
      title: 'You are set',
      before: go('/'),
      content: (
        <>
          <p>
            Restart this tour anytime from the header <strong>Tour</strong>{' '}
            button or the sidebar footer link.
          </p>
          <p>For reviewers: this build is a functional shell plus representative UI — production rollout still needs auth hardening, live market and OMS feeds, and your compliance sign-off.</p>
        </>
      ),
      skipBeacon: true,
    },
  ]
}
