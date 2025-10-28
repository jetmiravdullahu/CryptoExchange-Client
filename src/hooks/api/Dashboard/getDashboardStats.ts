import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getDashboardStats } from '@/api/Dashboard/getDashboardStats'

export const getDashboardStatsQuery = queryOptions({
  queryKey: ['getDashboardStats'],
  queryFn: getDashboardStats,
  retry: (failureCount, error: any) => {
    if (error?.response?.data?.success === false) return false
    return failureCount < 3
  },
})

export const useGetDashboardStatsSuspenseQuery = () => {
  return useSuspenseQuery(getDashboardStatsQuery)
}
