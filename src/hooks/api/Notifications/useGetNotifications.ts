import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getNotifications } from '@/api/Notification/getNotifications'

export const getNotificationsQuery = (opts?: {
  pagination: PaginationState
  sorting: SortingState
}) =>
  queryOptions({
    queryKey: [
      'getNotifications',
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
      },
    ],
    queryFn: () =>
      getNotifications(
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
    id: 'id',
    desc: true,
  },
]

export const useGetNotifications = () => {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const { data } = useSuspenseQuery(
    getNotificationsQuery({
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
