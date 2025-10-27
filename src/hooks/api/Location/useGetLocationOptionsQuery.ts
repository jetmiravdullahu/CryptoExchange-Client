import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getLocationOptions } from '@/api/Location/getLocationOptions'

export const getLocationOptionsQuery = queryOptions({
  queryKey: ['getLocationOptions'],
  queryFn: () => getLocationOptions(),
})

export const useGetLocationOptions = () => {
  return useSuspenseQuery(getLocationOptionsQuery)
}
