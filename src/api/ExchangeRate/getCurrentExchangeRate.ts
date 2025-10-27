import api from '..'
import type { SuccessResponse } from '../types'

interface IGetCurrentExchangeRatesResponseData {
  id: string
  from_asset_id: string
  to_asset_id: string
  rate: string
  effective_from: string
  effective_to: string | null
  is_active: boolean
  metadata: Array<any>
  created_at: string
  updated_at: string
}

export const getCurrentExchangeRate = async ({
  from_asset_id,
  to_asset_id,
}: {
  from_asset_id: string
  to_asset_id: string
}): Promise<SuccessResponse<IGetCurrentExchangeRatesResponseData>['data']> => {
  const { data } = await api.get<
    SuccessResponse<IGetCurrentExchangeRatesResponseData>
  >(`/exchange-rates/current`, {
    params: {
      from_asset_id,
      to_asset_id,
    },
  })

  return data.data
}
