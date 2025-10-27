import api from '..'
import type { FeeType } from '@/types/locationFee'
import type { PaginatedResponse } from '../types'
import type { TransactionStatusType } from '@/types/transaction'

interface ITransaction {
  location_id: string
  from_asset_id: string
  to_asset_id: string
  from_amount: string
  to_amount: string
  exchange_rate_id: string
  rate_value: string
  fee_flat: string
  fee_basis_type: FeeType
  fee_basis_value: string
  status: TransactionStatusType
  completed_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  created_by: {
    id: string
    email: string
    name: string
    role: string
    location_id: string
    is_active: boolean
    email_verified_at: string | null
    last_login_at: string
    created_at: string
    updated_at: string
  }
  rate_locked_at: string
  rate_expires_at: string
  id: string
  transaction_ref: string
  updated_at: string
  created_at: string
  location: {
    id: string
    code: string
    name: string
    address: string
    city: string
    country_code: string | null
    timezone: string
    is_active: boolean
    created_at: string
    updated_at: string
  }
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
  exchange_rate: {
    id: string
    from_asset_id: string
    to_asset_id: string
    rate: string
    effective_from: string
    effective_to: string
    is_active: boolean
    created_by: string
    created_at: string
    updated_at: string
  }
}

export const getTransactions = async (
  location_id?: string,
  opts?: {
    pagination: { pageIndex: number; pageSize: number }
    sorting: Array<{ id: string; desc: boolean }>
  },
): Promise<PaginatedResponse<ITransaction>['data']> => {
  const { data } = await api.get<PaginatedResponse<ITransaction>>(
    `/transactions`,
    {
      params: {
        ...(location_id && { location_id }),
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
