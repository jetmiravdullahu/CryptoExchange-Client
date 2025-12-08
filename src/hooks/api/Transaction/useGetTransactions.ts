import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import dayjs from 'dayjs'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getTransactions } from '@/api/Transaction/getTransactions'

interface FilterState {
  from?: string
  to?: string
}

export const getTransactionsQuery = (
  location_id?: string,
  opts?: {
    pagination: PaginationState
    sorting: SortingState
    filters: FilterState
  },
) =>
  queryOptions({
    queryKey: [
      'getTransactions',
      location_id,
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
        filters: initialFilters,
      },
    ],
    queryFn: () =>
      getTransactions(
        location_id,
        opts || {
          pagination: initialPagination,
          sorting: initialSorting,
          filters: initialFilters,
        },
      ),
  })

const initialPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 15,
}

const initialSorting: SortingState = [
  {
    id: 'created_at',
    desc: true,
  },
]

const initialFilters = {
  from: dayjs().startOf('month').format('YYYY-MM-DD'),
  to: dayjs().format('YYYY-MM-DD'),
}

export const useGetTransactions = (location_id?: string) => {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const onSetFilters = (key: string, value?: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPagination({ ...pagination, pageIndex: 0 })
  }

  const { data } = useSuspenseQuery(
    getTransactionsQuery(location_id, {
      pagination,
      sorting,
      filters,
    }),
  )

  return {
    data,
    filters,
    onSetFilters,
    pagination,
    sorting,
    setPagination,
    setSorting,
  }
}
