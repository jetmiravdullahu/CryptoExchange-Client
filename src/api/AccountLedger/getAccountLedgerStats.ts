import api from '..'
import type { IAccountLedgerStats } from '@/types/accountLedger'
import type { SuccessResponse } from '../types'

export const getAccountLedgerStats = async (
  id: string,
  filters?: {
    from?: string
    to?: string
    type?: string
  },
): Promise<SuccessResponse<IAccountLedgerStats>['data']> => {
  const { data } = await api.get<SuccessResponse<IAccountLedgerStats>>(
    `/accounts/${id}/ledger/stats`,
    filters && {
      params: {
        from: filters.from,
        to: filters.to,
        type: filters.type,
      },
    },
  )
  return data.data
}
