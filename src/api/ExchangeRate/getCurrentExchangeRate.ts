import api from '..'
import type { ErrorResponse, SuccessResponse } from '../types'

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
}): Promise<
  | SuccessResponse<IGetCurrentExchangeRatesResponseData>['data']
  | ErrorResponse<{
      id: string
      rate: string
    }>['data']
> => {
  try {
    const { data } = await api.get<
      SuccessResponse<IGetCurrentExchangeRatesResponseData>
    >(`/exchange-rates/current`, {
      params: {
        from_asset_id,
        to_asset_id,
      },
    })

    return data.data
  } catch (err: any) {
    // Handle HTTP 404s or other expected API failures
    if (err.response?.status === 404) {
      return {
        id: '',
        rate: '0',
      }
    }

    // Re-throw unexpected errors (network, 500, etc.)
    throw err
  }
}
