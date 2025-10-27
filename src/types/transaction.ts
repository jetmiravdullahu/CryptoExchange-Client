export type TransactionStatusType =
  | 'PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'TIMED_OUT'

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
