import api from '..'
import type { SuccessResponse } from '../types'
import type { ITransaction } from '@/types/transaction'


export const getTransaction = async (transactionId: string): Promise<SuccessResponse<ITransaction>['data']> => {
  const { data } = await api.get<
    SuccessResponse<ITransaction>
  >(`/transactions/${transactionId}`)

  return data.data
}
