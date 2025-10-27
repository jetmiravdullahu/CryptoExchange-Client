import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import type { TransactionsTableData } from '@/types/transaction'
import { getTransactions } from '@/api/Transaction/getTransactions'

export const getTransactionsQuery = (
  location_id?: string,
  opts?: {
    pagination: PaginationState
    sorting: SortingState
  },
) =>
  queryOptions({
    queryKey: [
      'getTransactions',
      location_id,
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
      },
    ],
    queryFn: () =>
      getTransactions(
        location_id,
        opts || {
          pagination: initialPagination,
          sorting: initialSorting,
        },
      ),
    select: (data) => {
      return {
        transactions: data.data.map((transaction) => ({
          id: transaction.id,
          from_asset: {
            id: transaction.from_asset.id,
            name: transaction.from_asset.name,
            value: transaction.from_amount,
            asset_class: transaction.from_asset.asset_class,
          },
          to_asset: {
            id: transaction.to_asset.id,
            name: transaction.to_asset.name,
            value: transaction.to_amount,
            asset_class: transaction.to_asset.asset_class,
          },
          fee_flat: transaction.fee_flat,
          rate_value: transaction.rate_value,
          status: transaction.status,
          location: {
            id: transaction.location.id,
            name: transaction.location.name,
          },
          cancelled_reason: transaction.cancellation_reason,
        })) as Array<TransactionsTableData>,
        pagination: {
          current_page: data.current_page,
          from: data.from,
          last_page: data.last_page,
          per_page: data.per_page,
          to: data.to,
          total: data.total,
        },
      }
    },
  })

const initialPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 15,
}

const initialSorting: SortingState = [
  {
    id: 'id',
    desc: true,
  },
]

export const useGetTransactions = (location_id?: string) => {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const { data } = useSuspenseQuery(
    getTransactionsQuery(location_id, {
      pagination,
      sorting,
    }),
  )

  return {
    data,
    pagination,
    sorting,
    setPagination,
    setSorting,
  }
}
