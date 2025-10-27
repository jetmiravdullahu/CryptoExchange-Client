import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAccounts } from '@/api/Account/getAccounts'

export const getAccountsQuery = 
  queryOptions({
    queryKey: ['getAccounts'],
    queryFn: () => getAccounts(),
    retry: (failureCount, error: any) => {
      if (error?.response?.data?.success === false) return false
      return failureCount < 3
    },
  })

export const useGetAccountsQuery = () => {
  return useSuspenseQuery(getAccountsQuery)
}
