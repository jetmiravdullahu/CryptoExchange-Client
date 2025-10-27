import api from '..'
import type { ITransfer } from '@/types/transfer';
import type { PaginatedResponse } from '../types'


export const getTransfers = async (
  location_id?: string,
  opts?: {
    pagination: { pageIndex: number; pageSize: number }
    sorting: Array<{ id: string; desc: boolean }>
  },
): Promise<PaginatedResponse<ITransfer>['data']> => {
  const { data } = await api.get<PaginatedResponse<ITransfer>>(
    `/transfers`,
    {
      params: {
        ...(location_id && { location_id }),
        ...(opts && {
          per_page: opts.pagination.pageSize,
          page: opts.pagination.pageIndex + 1,
          sort: opts.sorting[0].id,
          direction: opts.sorting[0].desc ? 'desc' : 'asc',
        }),
      },
    },
  )

  return data.data
}
