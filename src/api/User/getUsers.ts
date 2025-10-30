import api from '..'
import type { IUser } from '@/types/user'
import type { PaginatedResponse } from '../types'

export const getUsers = async (opts?: {
  pagination: { pageIndex: number; pageSize: number }
  sorting: Array<{ id: string; desc: boolean }>
}): Promise<PaginatedResponse<IUser>['data']> => {
  const { data } = await api.get<PaginatedResponse<IUser>>(
    '/users',
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
