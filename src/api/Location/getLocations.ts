import api from '..'
import type { PaginatedResponse } from '../types'
import type { ILocation } from '@/types/location'

export const getLocations = async (opts?: {
  pagination: { pageIndex: number; pageSize: number }
  sorting: Array<{ id: string; desc: boolean }>
}): Promise<PaginatedResponse<ILocation>['data']> => {
  const { data } = await api.get<PaginatedResponse<ILocation>>(
    '/locations',
    opts && {
      params: {
        per_page: opts.pagination.pageSize,
        page: opts.pagination.pageIndex + 1,
        sort: opts.sorting[0].id,
        direction: opts.sorting[0].desc ? 'desc' : 'asc',
      },
    },
  )
  return data.data
}
