import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getSellers } from '@/api/User/getSellers'

export const getSellersQuery = queryOptions({
  queryKey: ['getSellers'],
  queryFn: () => getSellers(),
})

export const useGetSellers = () => {
  return useSuspenseQuery(getSellersQuery)
}
