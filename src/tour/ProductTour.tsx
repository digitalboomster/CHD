import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { EVENTS, Joyride, STATUS, type EventHandler } from 'react-joyride'
import { buildChdTourSteps } from './chdTourSteps'

const STORAGE_KEY = 'chd_welcome_tour_v1_done'

type ProductTourContextValue = {
  startTour: () => void
  resetTourProgress: () => void
}

const ProductTourContext = createContext<ProductTourContextValue | null>(null)

export function useProductTour() {
  const ctx = useContext(ProductTourContext)
  if (!ctx) {
    throw new Error('useProductTour must be used within ProductTour')
  }
  return ctx
}

/** Optional: components outside the strict tree (e.g. lazy edge cases). */
export function useProductTourOptional() {
  return useContext(ProductTourContext)
}

type ProductTourProps = { children: ReactNode }

export function ProductTour({ children }: ProductTourProps) {
  const navigate = useNavigate()
  const [run, setRun] = useState(false)
  const [tourKey, setTourKey] = useState(0)

  const steps = useMemo(() => buildChdTourSteps(navigate), [navigate])

  const beginTour = useCallback(() => {
    setTourKey((k) => k + 1)
    setRun(true)
  }, [])

  const startTour = beginTour

  const resetTourProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = window.setTimeout(() => beginTour(), 1000)
    return () => window.clearTimeout(t)
  }, [beginTour])

  const handleEvent = useCallback<EventHandler>(
    (data) => {
      if (data.type !== EVENTS.TOUR_END) return
      if (data.status !== STATUS.FINISHED && data.status !== STATUS.SKIPPED) return
      localStorage.setItem(STORAGE_KEY, '1')
      setRun(false)
      navigate('/')
    },
    [navigate],
  )

  const ctx = useMemo(
    () => ({ startTour, resetTourProgress }),
    [startTour, resetTourProgress],
  )

  return (
    <ProductTourContext.Provider value={ctx}>
      {children}
      {/*
        Unmount when not running so Joyride portals/beacons/loaders cannot stick
        after finish/skip. skipBeacon: tooltips only — the gold pulsing orb
        mispositions across route changes and scroll regions.
      */}
      {run ? (
        <Joyride
          key={tourKey}
          run
          steps={steps}
          continuous
          scrollToFirstStep
          onEvent={handleEvent}
          options={{
            showProgress: true,
            buttons: ['back', 'close', 'skip', 'primary'],
            skipBeacon: true,
            primaryColor: '#c9a84c',
            backgroundColor: '#161b22',
            textColor: '#f0f6fc',
            overlayColor: 'rgba(1, 4, 9, 0.78)',
            arrowColor: '#161b22',
            zIndex: 20000,
          }}
          styles={{
            tooltip: {
              borderRadius: 10,
              fontSize: 14,
            },
            tooltipTitle: {
              fontSize: 16,
              marginBottom: 8,
            },
            buttonPrimary: {
              borderRadius: 6,
              fontWeight: 600,
            },
            buttonBack: {
              color: '#8b949e',
            },
            buttonSkip: {
              color: '#6e7681',
            },
          }}
          locale={{
            back: 'Back',
            close: 'Close',
            last: 'Done',
            next: 'Next',
            skip: 'Skip tour',
          }}
        />
      ) : null}
    </ProductTourContext.Provider>
  )
}
