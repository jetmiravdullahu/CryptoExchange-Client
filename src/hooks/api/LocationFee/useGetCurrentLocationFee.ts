import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getCurrentLocationFee } from '@/api/LocationFee/getCurrentLocaationFee'

export const getCurrentLocationFeeQuery = (location_id?: string) =>
  queryOptions({
    queryKey: ['getCurrentLocationFee', location_id],
    queryFn: () => getCurrentLocationFee({ location_id }),
    retry: (failureCount, error: any) => {
      if (error?.response?.data?.success === false) return false
      return failureCount < 3
    },
  })

export const useGetCurrentLocationFee = (location_id?: string) => {
  return useQuery(
    getCurrentLocationFeeQuery(location_id),
  )
}

export const useGetCurrentLocationFeeSuspenseQuery = (location_id?: string) => {
  return useSuspenseQuery(
    getCurrentLocationFeeQuery(location_id),
  )
}

