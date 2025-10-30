import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getCorrections } from '@/api/Corrections/getCorrections'

export const getCorrectionsQuery = (opts?: {
  pagination: PaginationState
  sorting: SortingState
}) =>
  queryOptions({
    queryKey: [
      'getCorrections',
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
      },
    ],
    queryFn: () =>
      getCorrections(
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

export const useGetCorrections = () => {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const { data } = useSuspenseQuery(
    getCorrectionsQuery({
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
