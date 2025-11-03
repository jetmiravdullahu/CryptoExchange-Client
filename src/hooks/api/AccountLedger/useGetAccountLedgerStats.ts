import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAccountLedgerStats } from '@/api/AccountLedger/getAccountLedgerStats'

export const getAccountLedgerStatsQuery = (id: string) =>
  queryOptions({
    queryKey: ['getAccountLedgerStats', id],
    queryFn: () => getAccountLedgerStats(id),
  })

export const useGetAccountLedgerStats = (id: string) => {
  return useSuspenseQuery(getAccountLedgerStatsQuery(id))
}
