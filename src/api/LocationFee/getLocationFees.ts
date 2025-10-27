import api from '..'
import type { FeeType } from '@/types/locationFee'
import type { PaginatedResponse } from '../types'

interface IGetLocationsResponseData {
  id: string
  fee_type: FeeType
  fee_value: number
  min_fee?: number
  max_fee?: number
  is_active: boolean
}

export const getLocationFees = async (
  location_id: string,
  opts?: {
    pagination: { pageIndex: number; pageSize: number }
    sorting: Array<{ id: string; desc: boolean }>
  },
): Promise<PaginatedResponse<IGetLocationsResponseData>['data']> => {
  const { data } = await api.get<PaginatedResponse<IGetLocationsResponseData>>(
    `/location-fees`,
    {
      params: {
        location_id,
        ...(opts && {
          per_page: opts.pagination.pageSize,
          page: opts.pagination.pageIndex + 1,
          sort: opts.sorting[0].id,
          direction: opts.sorting[0].desc ? 'desc' : 'asc',
        }),
      },
    },
  )

  return data.data
}
