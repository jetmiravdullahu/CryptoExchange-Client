import api from '..'
import type { IAccountLedger } from '@/types/accountLedger'
import type { PaginatedResponse } from '../types'
import type { PaginationState, SortingState } from '@tanstack/react-table'

export const getAccountLedger = async (opts?: {
  id: string
  pagination: PaginationState
  sorting: SortingState
  filters?: {
    from?: string
    to?: string
    type?: string
  }
}): Promise<PaginatedResponse<IAccountLedger>['data']> => {
  const { data } = await api.get<PaginatedResponse<IAccountLedger>>(
    `/accounts/${opts?.id}/ledger`,
    opts && {
      params: {
        per_page: opts.pagination.pageSize,
        page: opts.pagination.pageIndex + 1,
        sort_order: opts.sorting[0]?.desc ? 'desc' : 'asc',
        from: opts.filters?.from,
        to: opts.filters?.to,
        type: opts.filters?.type,
      },
    },
  )
  return data.data
}
