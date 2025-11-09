import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import dayjs from 'dayjs';
import { getAccountLedgerStats } from '@/api/AccountLedger/getAccountLedgerStats'

export const getAccountLedgerStatsQuery = (
  id: string,
  filters?: { from?: string; to?: string; type?: string },
) =>
  queryOptions({
    queryKey: ['getAccountLedgerStats', id, filters || initialFilters],
    queryFn: () => getAccountLedgerStats(id, filters || initialFilters),
  })

const initialFilters = {
  from: dayjs().startOf('month').format('YYYY-MM-DD'),
  to: dayjs().format('YYYY-MM-DD'),
}

export const useGetAccountLedgerStats = (
  id: string,
  filters?: { from?: string; to?: string },
) => {
  return useSuspenseQuery(getAccountLedgerStatsQuery(id, filters))
}
