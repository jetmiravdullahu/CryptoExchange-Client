import api from '..'
import type { PaginatedResponse } from '../types'

interface IGetExchangeRatesResponseData {
  id: string
  from_asset_id: string
  from_asset: {
    id: string
    code: string
    name: string
    asset_class: string
    precision: number
    min_amount: string
    max_amount: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }
  to_asset: {
    id: string
    code: string
    name: string
    asset_class: string
    precision: number
    min_amount: string
    max_amount: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }
  to_asset_id: string
  rate: number
  effective_from: string
  effective_to: string | null
  is_active: boolean
  metadata: Array<any>
  created_at: string
  updated_at: string
}

export const getExchangeRates = async (
  asset_id: string,
  opts?: {
    pagination: { pageIndex: number; pageSize: number }
    sorting: Array<{ id: string; desc: boolean }>
  },
): Promise<PaginatedResponse<IGetExchangeRatesResponseData>['data']> => {
  const { data } = await api.get<
    PaginatedResponse<IGetExchangeRatesResponseData>
  >(`/exchange-rates`, {
    params: {
      from_asset_id: asset_id,
      ...(opts && {
        per_page: opts.pagination.pageSize,
        page: opts.pagination.pageIndex + 1,
        sort: opts.sorting[0].id,
        direction: opts.sorting[0].desc ? 'desc' : 'asc',
      }),
    },
  })

  return data.data
}
