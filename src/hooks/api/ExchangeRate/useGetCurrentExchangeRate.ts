import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getCurrentExchangeRate } from '@/api/ExchangeRate/getCurrentExchangeRate'

export const getCurrentExchangeRateQuery = ({
  from_asset_id,
  to_asset_id,
}: {
  from_asset_id: string
  to_asset_id: string
}) =>
  queryOptions({
    queryKey: ['getCurrentExchangeRate', from_asset_id, to_asset_id],
    queryFn: () =>
      getCurrentExchangeRate({
        from_asset_id,
        to_asset_id,
      }),
    retry: (failureCount, error: any) => {
      if (error?.response?.data?.success === false) return false
      return failureCount < 3
    },
  })

export const useGetCurrentExchangeRate = ({
  from_asset_id,
  to_asset_id,
}: {
  from_asset_id: string
  to_asset_id: string
}) => {
  return useQuery(
    getCurrentExchangeRateQuery({
      from_asset_id,
      to_asset_id,
    }),
  )
}

export const useGetCurrentExchangeRateSuspenseQuery = ({
  from_asset_id,
  to_asset_id,
}: {
  from_asset_id: string
  to_asset_id: string
}) => {
  return useSuspenseQuery(
    getCurrentExchangeRateQuery({
      from_asset_id,
      to_asset_id,
    }),
  )
}
