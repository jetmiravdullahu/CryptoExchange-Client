import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getExchangeRates } from '@/api/ExchangeRate/getExchangeRates'

export const getExchangeRatesQuery = (
  asset_id: string,
  opts?: {
    pagination: PaginationState
    sorting: SortingState
  },
) =>
  queryOptions({
    queryKey: [
      'getExchangeRates',
      asset_id,
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
      },
    ],
    queryFn: () =>
      getExchangeRates(
        asset_id,
        opts || {
          pagination: initialPagination,
          sorting: initialSorting,
        },
      ),
    select: (data) => {
      return {
        exchangeRates: data.data.map((exchangeRate) => ({
          id: exchangeRate.id,
          from_asset_id: exchangeRate.from_asset_id,
          to_asset_id: exchangeRate.to_asset_id,
          rate: exchangeRate.rate,
          effective_from: exchangeRate.effective_from,
          effective_to: exchangeRate.effective_to,
          from_asset: exchangeRate.from_asset,
          to_asset: exchangeRate.to_asset,
          is_active: exchangeRate.is_active,
        })),
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

export const useGetExchangeRates = (asset_id: string) => {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const { data } = useSuspenseQuery(
    getExchangeRatesQuery(asset_id, {
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
