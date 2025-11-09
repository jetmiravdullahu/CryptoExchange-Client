import api from '..'

import type { SuccessResponse } from '../types'
import type { ITransaction } from '@/types/transaction'

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
): Promise<SuccessResponse<ITransaction>> => {
  const { data } = await api.post<SuccessResponse<ITransaction>>(
    '/transactions',
    input,
  )

  return data
}
