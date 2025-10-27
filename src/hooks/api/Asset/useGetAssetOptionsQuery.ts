import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAssetOptions } from '@/api/Asset/getAssetOptions'

export const getAssetOptionsQuery = queryOptions({
  queryKey: ['getAssetOptions'],
  queryFn: () => getAssetOptions(),
})

export const useGetAssetOptions = () => {
  return useSuspenseQuery(getAssetOptionsQuery)
}
