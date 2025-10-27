import {
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getUsers } from '@/api/User/getUsers'

export const getUsersQuery = (opts?: {
  pagination: PaginationState
  sorting: SortingState
}) =>
  queryOptions({
    queryKey: [
      'getUsers',
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
      },
    ],
    queryFn: () =>
      getUsers(
        opts || {
          pagination: initialPagination,
          sorting: initialSorting,
        },
      ),
    select: (data) => {
      return {
        users: data.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location_id,
          is_active: user.is_active,
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
    id: 'name',
    desc: true,
  },
]

export const useGetUsers = () => {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const { data } = useSuspenseQuery(
    getUsersQuery({
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
