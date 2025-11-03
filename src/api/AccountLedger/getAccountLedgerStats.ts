import api from '..'
import type { IAccountLedgerStats } from '@/types/accountLedger'
import type { SuccessResponse } from '../types'

export const getAccountLedgerStats = async (
  id: string,
): Promise<SuccessResponse<IAccountLedgerStats>['data']> => {
  const { data } = await api.get<SuccessResponse<IAccountLedgerStats>>(
    `/accounts/${id}/ledger/stats`,
  )
  return data.data
}
