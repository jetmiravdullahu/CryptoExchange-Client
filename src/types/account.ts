import z from 'zod'
import type { IAsset } from './asset'
import type { ILocation } from './location'

export type AccountOwnerType = 'LOCATION' | 'BASE' | 'TRANSIT'

export const AccountSchema = (max_amount?: string) =>
  z.object({
    amount: z
      .string()
      .trim()
      .refine((v) => parseFloat(v) > 0, 'Amount is required')
      .refine((v) => {
        console.log({ v, max_amount })
        return max_amount ? parseFloat(v) <= parseFloat(max_amount) : true
      }, 'Amount cannot exceed maximum limit')
      .refine((v) => /^\d+(\.\d+)?$/.test(v), 'Amount must be a valid number')
      .refine((v) => Number(v) >= 0.001, 'Amount must be at least 0.001'),
    description: z.string().trim().min(1, 'Description is required'),
  })

export type TransactionType = 'deposit' | 'withdraw'

export interface AccountTransactionInput {
  amount: string
  description: string
  account_id: string
  type: TransactionType
  current_balance: string
}

export interface Account {
  id: string
  asset_id: string
  owner_type: AccountOwnerType
  owner_id: string
  balance: string
  reserved_balance: string
  last_reconciled_at: string | null
  created_at: string
  updated_at: string
  asset: IAsset
  location: ILocation
}
