import type { FundDto } from '../api/types'
import type { DataSource } from '../api/hooks'

export type AppShellOutletContext = {
  fundId: string
  activeFundLabel: string
  funds: FundDto[]
  fundsLoading: boolean
  fundsError: Error | null
  fundsSource: DataSource
}
