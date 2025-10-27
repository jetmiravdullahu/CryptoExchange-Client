import api from '..'
import type { SuccessResponse } from '../types'

interface ICompleteTransaction {}

export const completeTransaction = async (
  transactionId: string,
): Promise<SuccessResponse<ICompleteTransaction>> => {
  const { data } = await api.post<SuccessResponse<ICompleteTransaction>>(
    `/transactions/${transactionId}/complete`,
  )

  return data
}
