import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getLocationFees } from '@/api/LocationFee/getLocationFees'

export const getLocationFeesQuery = (
  locationId: string,
  opts?: {
    pagination: PaginationState
    sorting: SortingState
  },
) =>
  queryOptions({
    queryKey: [
      'getLocationFees',
      locationId,
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
      },
    ],
    queryFn: () =>
      getLocationFees(
        locationId,
        opts || {
          pagination: initialPagination,
          sorting: initialSorting,
        },
      ),
    select: (data) => {
      return {
        locationFees: data.data.map((location) => ({
          id: location.id,
          fee_type: location.fee_type,
          fee_value: location.fee_value,
          min_fee: location.min_fee,
          max_fee: location.max_fee,
          is_active: location.is_active,
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
    id: 'created_at',
    desc: true,
  },
]

export const useGetLocationFees = (locationId: string) => {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const { data } = useSuspenseQuery(
    getLocationFeesQuery(locationId, {
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
