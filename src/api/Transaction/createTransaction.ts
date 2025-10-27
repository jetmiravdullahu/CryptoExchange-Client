import api from '..'
import type { FeeType } from '@/types/locationFee'

import type { SuccessResponse } from '../types'

interface ICreateTransaction {
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
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
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

interface ICreateTransactionInput {
  location_id: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  from_asset_id: string
  to_asset_id: string
  from_amount: number
  to_amount: number
  exchange_rate_id: string
  rate_value: number
  fee_flat: number
  fee_basis_type: string
  fee_basis_value: number
}

export const createTransaction = async (
  input: ICreateTransactionInput,
): Promise<SuccessResponse<ICreateTransaction>> => {
  const { data } = await api.post<SuccessResponse<ICreateTransaction>>(
    '/transactions',
    input,
  )

  return data
}
