import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getLocations } from '@/api/Location/getLocations'

export const getLocationsQuery = (opts?: {
  pagination: PaginationState
  sorting: SortingState
}) =>
  queryOptions({
    queryKey: [
      'getLocations',
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
      },
    ],
    queryFn: () =>
      getLocations(
        opts || {
          pagination: initialPagination,
          sorting: initialSorting,
        },
      ),
    select: (data) => {
      return {
        locations: data.data.map((location) => ({
          id: location.id,
          name: location.name,
          code: location.code,
          address: location.address,
          city: location.city,
          is_active: location.is_active,
          user: {
            id: location.user.id,
            name: location.user.name,
          },
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

export const useGetLocations = () => {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const { data } = useSuspenseQuery(
    getLocationsQuery({
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
