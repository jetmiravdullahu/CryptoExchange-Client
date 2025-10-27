import api from '..'
import type { AssetClass } from '@/types/asset'
import type { PaginatedResponse } from '../types'

interface IGetAssetsResponseData {
  id: string
  code: string
  name: string
  asset_class: AssetClass
  precision: number
  min_amount: string
  max_amount: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  accounts: Array<{
    id: string
    asset_id: string
    owner_type: string
    owner_id: string | null
    balance: string
    reserved_balance: string
    last_reconciled_at: string | null
    metadata: Record<string, any>
    created_at: string
    updated_at: string
  }>
}

export const getAssets = async (opts?: {
  pagination: { pageIndex: number; pageSize: number }
  sorting: Array<{ id: string; desc: boolean }>
}): Promise<PaginatedResponse<IGetAssetsResponseData>['data']> => {
  const { data } = await api.get<PaginatedResponse<IGetAssetsResponseData>>(
    '/assets',
    opts && {
      params: {
        per_page: opts.pagination.pageSize,
        page: opts.pagination.pageIndex + 1,
        sort: opts.sorting[0].id,
        direction: opts.sorting[0].desc ? 'desc' : 'asc',
      },
    },
  )
  return data.data
}
