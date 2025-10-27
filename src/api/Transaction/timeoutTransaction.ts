import api from '..'
import type { SuccessResponse } from '../types'

interface ITimeoutTransaction {}

export const timeoutTransaction = async ({
  transactionId,
}: {
  transactionId: string
}): Promise<SuccessResponse<ITimeoutTransaction>> => {
  const { data } = await api.post<SuccessResponse<ITimeoutTransaction>>(
    `/transactions/${transactionId}/timeout`,
  )

  return data
}
