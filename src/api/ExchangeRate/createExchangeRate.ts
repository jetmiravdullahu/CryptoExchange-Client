import api from '..'

import type { SuccessResponse } from '../types'

interface IExchangeRateResponseData {
  id: string
  from_asset_id: string
  to_asset_id: string
  rate: number
  effective_from: string
  effective_to: string | null
  is_active: boolean
  metadata: Array<any>
  created_at: string
  updated_at: string
}

export const createExchangeRate = async (input: {
  from_asset_id: string
  to_asset_id: string
  rate: number
  effective_from: string
  effective_to?: string
  is_active: boolean
}): Promise<SuccessResponse<IExchangeRateResponseData>> => {
  const { data } = await api.post<SuccessResponse<IExchangeRateResponseData>>(
    '/exchange-rates',
    input,
  )

  return data
}
