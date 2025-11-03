import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAccounts } from '@/api/Account/getAccounts'

export const getAccountsQuery = 
  queryOptions({
    queryKey: ['getAccounts'],
    queryFn: () => getAccounts(),
  })

export const useGetAccountsQuery = () => {
  return useSuspenseQuery(getAccountsQuery)
}
