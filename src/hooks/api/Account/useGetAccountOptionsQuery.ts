import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAccountOptions } from '@/api/Account/getAccountOptions'

export const getAccountOptionsQuery = queryOptions({
  queryKey: ['getAccountOptions'],
  queryFn: () => getAccountOptions(),
})

export const useGetAccountOptions = () => {
  return useSuspenseQuery(getAccountOptionsQuery)
}
