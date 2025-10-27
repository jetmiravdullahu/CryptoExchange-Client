import api from '..'
import type { SuccessResponse } from '../types'

interface ICancelTransaction {}

export const cancelTransaction = async ({
  transactionId,
  cancellation_reason,
}: {
  transactionId: string
  cancellation_reason?: string
}): Promise<SuccessResponse<ICancelTransaction>> => {
  const { data } = await api.post<SuccessResponse<ICancelTransaction>>(
    `/transactions/${transactionId}/cancel`,
    {
      cancellation_reason,
    },
  )

  return data
}
