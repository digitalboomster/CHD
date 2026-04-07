import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { AppShell } from './layout/AppShell'
import { ProductTour } from './tour/ProductTour'

const ExecutiveDashboard = lazy(() =>
  import('./pages/ExecutiveDashboard').then((m) => ({ default: m.ExecutiveDashboard })),
)
const NIDFOverview = lazy(() =>
  import('./pages/NIDFOverview').then((m) => ({ default: m.NIDFOverview })),
)
const MacroRegime = lazy(() =>
  import('./pages/MacroRegime').then((m) => ({ default: m.MacroRegime })),
)
const AlphaSignals = lazy(() =>
  import('./pages/AlphaSignals').then((m) => ({ default: m.AlphaSignals })),
)
const FixedIncomeSignalsPage = lazy(() =>
  import('./pages/FixedIncomeSignalsPage').then((m) => ({
    default: m.FixedIncomeSignalsPage,
  })),
)
const EurobondSignalsPage = lazy(() =>
  import('./pages/EurobondSignalsPage').then((m) => ({ default: m.EurobondSignalsPage })),
)
const FactorBacktestPage = lazy(() =>
  import('./pages/FactorBacktestPage').then((m) => ({ default: m.FactorBacktestPage })),
)
const MandateCompliance = lazy(() =>
  import('./pages/MandateCompliance').then((m) => ({ default: m.MandateCompliance })),
)
const PreTradeCheckPage = lazy(() =>
  import('./pages/PreTradeCheckPage').then((m) => ({ default: m.PreTradeCheckPage })),
)
const StressTestingPage = lazy(() =>
  import('./pages/StressTestingPage').then((m) => ({ default: m.StressTestingPage })),
)
const VarAttributionPage = lazy(() =>
  import('./pages/VarAttributionPage').then((m) => ({ default: m.VarAttributionPage })),
)
const TradeBlotter = lazy(() =>
  import('./pages/TradeBlotter').then((m) => ({ default: m.TradeBlotter })),
)
const FmdqRfqPage = lazy(() =>
  import('./pages/FmdqRfqPage').then((m) => ({ default: m.FmdqRfqPage })),
)
const NgxOrderPage = lazy(() =>
  import('./pages/NgxOrderPage').then((m) => ({ default: m.NgxOrderPage })),
)
const PostTradeAllocationPage = lazy(() =>
  import('./pages/PostTradeAllocationPage').then((m) => ({
    default: m.PostTradeAllocationPage,
  })),
)
const FactsheetPage = lazy(() =>
  import('./pages/FactsheetPage').then((m) => ({ default: m.FactsheetPage })),
)
const IcDeckPage = lazy(() =>
  import('./pages/IcDeckPage').then((m) => ({ default: m.IcDeckPage })),
)
const EsgImpactPage = lazy(() =>
  import('./pages/EsgImpactPage').then((m) => ({ default: m.EsgImpactPage })),
)
const MacroTerminalPage = lazy(() =>
  import('./pages/MacroTerminalPage').then((m) => ({ default: m.MacroTerminalPage })),
)
const SecurityDeepDivePage = lazy(() =>
  import('./pages/SecurityDeepDivePage').then((m) => ({
    default: m.SecurityDeepDivePage,
  })),
)
const PeerBenchmarkPage = lazy(() =>
  import('./pages/PeerBenchmarkPage').then((m) => ({ default: m.PeerBenchmarkPage })),
)
const MpcCalendarPage = lazy(() =>
  import('./pages/MpcCalendarPage').then((m) => ({ default: m.MpcCalendarPage })),
)
const RolesPermissionsPage = lazy(() =>
  import('./pages/RolesPermissionsPage').then((m) => ({
    default: m.RolesPermissionsPage,
  })),
)
const ModelConfigPage = lazy(() =>
  import('./pages/ModelConfigPage').then((m) => ({ default: m.ModelConfigPage })),
)
const ReviewerHandoffPage = lazy(() =>
  import('./pages/ReviewerHandoffPage').then((m) => ({
    default: m.ReviewerHandoffPage,
  })),
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ProductTour>
        <Routes>
        <Route element={<AppShell />}>
          <Route index element={<ExecutiveDashboard />} />
          <Route path="funds/nidf" element={<NIDFOverview />} />
          <Route path="macro" element={<MacroRegime />} />
          <Route path="signals/equity" element={<AlphaSignals />} />
          <Route path="signals/fi" element={<FixedIncomeSignalsPage />} />
          <Route path="signals/eurobond" element={<EurobondSignalsPage />} />
          <Route path="research/backtest" element={<FactorBacktestPage />} />
          <Route path="compliance" element={<MandateCompliance />} />
          <Route path="compliance/pre-trade" element={<PreTradeCheckPage />} />
          <Route path="risk/stress" element={<StressTestingPage />} />
          <Route path="risk/var" element={<VarAttributionPage />} />
          <Route path="trade/blotter" element={<TradeBlotter />} />
          <Route path="trade/rfq" element={<FmdqRfqPage />} />
          <Route path="trade/ngx" element={<NgxOrderPage />} />
          <Route path="trade/allocation" element={<PostTradeAllocationPage />} />
          <Route path="reports/factsheet" element={<FactsheetPage />} />
          <Route path="reports/ic" element={<IcDeckPage />} />
          <Route path="reports/esg" element={<EsgImpactPage />} />
          <Route path="research/macro-terminal" element={<MacroTerminalPage />} />
          <Route path="research/security" element={<SecurityDeepDivePage />} />
          <Route path="research/peer" element={<PeerBenchmarkPage />} />
          <Route path="research/mpc" element={<MpcCalendarPage />} />
          <Route path="settings/users" element={<RolesPermissionsPage />} />
          <Route path="settings/models" element={<ModelConfigPage />} />
          <Route path="review/handoff" element={<ReviewerHandoffPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        </Routes>
        </ProductTour>
      </BrowserRouter>
    </AuthProvider>
  )
}
