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

export const createLocation = async (input: {
  code: string
  name: string
  address: string
  city: string
  user_id: string | null
  is_active: boolean
}): Promise<SuccessResponse<ILocationResponseData>> => {
  const { data } = await api.post<SuccessResponse<ILocationResponseData>>(
    '/locations',
    input,
  )

  return data
}
