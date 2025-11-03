import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getAccountLedger } from '@/api/AccountLedger/getAccountLedger'

interface FilterState {
  from?: string
  to?: string
  type?: string
}

export const getAccountLedgerQuery = (
  id: string,
  opts?: {
    pagination: PaginationState
    sorting: SortingState
    filters: FilterState
  },
) =>
  queryOptions({
    queryKey: [
      'getAccountLedger',
      id,
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
        filters: {}
      },
    ],
    queryFn: () =>
      getAccountLedger(
        opts
          ? {
              id,
              ...opts,
            }
          : {
              id,
              pagination: initialPagination,
              sorting: initialSorting,
            },
      ),
  })

const initialPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 15,
}

const initialSorting: SortingState = [
  {
    id: 'entry_number',
    desc: true,
  },
]

export function useGetAccountLedger(id: string) {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [filters, setFilters] = useState<FilterState>({})

  const onSetFilters = (key: keyof typeof filters, value?: string) => {
    console.log({ key, value })
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPagination({ ...pagination, pageIndex: 0 })
  }

  const { data } = useSuspenseQuery(
    getAccountLedgerQuery(id, {
      pagination,
      sorting,
      filters,
    }),
  )

  return {
    data,
    pagination,
    sorting,
    setPagination,
    setSorting,
    filters,
    onSetFilters,
  }
}
