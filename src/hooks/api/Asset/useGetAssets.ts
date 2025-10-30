import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getAssets } from '@/api/Asset/getAssets'

export const getAssetsQuery = (opts?: {
  pagination: PaginationState
  sorting: SortingState
}) =>
  queryOptions({
    queryKey: [
      'getAssets',
      opts || {
        pagination: initialPagination,
        sorting: initialSorting,
      },
    ],
    queryFn: () =>
      getAssets(
        opts || {
          pagination: initialPagination,
          sorting: initialSorting,
        },
      ),
    select: (data) => {
      return {
        assets: data.data.map((asset) => ({
          id: asset.id,
          asset_class: asset.asset_class,
          code: asset.code,
          name: asset.name,
          is_active: asset.is_active,
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

export function useGetAssets() {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination)

  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const { data } = useSuspenseQuery(
    getAssetsQuery({
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
