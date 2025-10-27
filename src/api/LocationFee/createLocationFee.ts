import api from '..'

import type { SuccessResponse } from '../types'

interface ILocationResponseData {
  id: string
  name: string
  code: string
  address: string
  city: string
  country_code: string
  timezone: string
  user_id: string
  is_active: boolean
  metadata: Array<any>
  created_at: string
  updated_at: string
}

export const createLocationFee = async (input: {
  location_id: string
  fee_type: string
  fee_value: number
  min_fee?: number
  max_fee?: number
  is_active: boolean
}): Promise<SuccessResponse<ILocationResponseData>> => {
  const { data } = await api.post<SuccessResponse<ILocationResponseData>>(
    '/location-fees',
    input,
  )

  return data
}
