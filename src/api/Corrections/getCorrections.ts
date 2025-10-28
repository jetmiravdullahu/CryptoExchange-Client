import api from '..'
import type { Correction } from '@/types/correction'
import type { PaginatedResponse } from '../types'

export const getCorrections = async (opts?: {
  pagination: { pageIndex: number; pageSize: number }
  sorting: Array<{ id: string; desc: boolean }>
}): Promise<PaginatedResponse<Correction>['data']> => {
  const { data } = await api.get<PaginatedResponse<Correction>>(
    `/corrections`,
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
