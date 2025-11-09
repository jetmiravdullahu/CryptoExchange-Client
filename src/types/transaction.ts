import type { IAsset } from "./asset"
import type { ILocation } from "./location"
import type { FeeType } from "./locationFee"
import type { IUser } from "./user"

export type TransactionStatusType =
  | 'PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'TIMED_OUT'

export interface ITransaction {
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
  created_by: IUser
  rate_locked_at: string
  rate_expires_at: string
  id: string
  transaction_ref: string
  updated_at: string
  created_at: string
  location: ILocation
  from_asset: IAsset
  to_asset: IAsset
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

export type TransactionsTableData = {
  id: string
  from_asset: {
    id: string
    name: string
    value: string
    asset_class: string
  }
  to_asset: {
    id: string
    name: string
    value: string
    asset_class: string
  }
  to_value: string
  fee_flat: string
  rate_value: string
  status: TransactionStatusType
  location: {
    id: string
    name: string
  }
  cancelled_reason: string | null
}

export type TransactionFormData = {
  id: string
  from_asset: {
    id: string
    name: string
    value: string
    asset_class: string
  }
  to_asset: {
    id: string
    name: string
    value: string
    asset_class: string
  }
  to_value: string
  fee_flat: string
  rate_value: string
  location: {
    id: string
    name: string
  }
}
