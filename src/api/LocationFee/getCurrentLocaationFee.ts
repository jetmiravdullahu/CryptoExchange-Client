import api from '..'
import type { FeeType } from '@/types/locationFee'
import type { SuccessResponse } from '../types'

interface IGetCurrentLocationFeeResponseData {
  id: string
  location_id: string
  fee_type: FeeType
  fee_value: number
  min_fee: number | null
  max_fee: number | null
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export const getCurrentLocationFee = async ({
  location_id,
}: {
  location_id?: string
}): Promise<SuccessResponse<IGetCurrentLocationFeeResponseData>['data']> => {
  const { data } = await api.get<
    SuccessResponse<IGetCurrentLocationFeeResponseData>
  >(`/location-fees/current`, {
    ...(location_id && {
      params: {
        location_id,
      },
    }),
  })

  return data.data
}
