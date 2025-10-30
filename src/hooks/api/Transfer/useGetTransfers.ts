import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getTransfers } from '@/api/Transfer/getTransfers'

export const getTransfersQuery = (
  location_id?: string,
  opts?: {
    pagination: PaginationState
    sorting: SortingState
  },
) =>
  queryOptions({
    queryKey: [
      'getTransfers',
      location_id,
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
      },
    ],
    queryFn: () =>
      getTransfers(
        location_id,
        opts || {
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
    id: 'created_at',
    desc: true,
  },
]

export const useGetTransfers = (location_id?: string) => {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const { data } = useSuspenseQuery(
    getTransfersQuery(location_id, {
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
