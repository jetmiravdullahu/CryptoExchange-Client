import api from '..'
import type { SuccessResponse } from '../types'
import type { ITransfer } from '@/types/transfer'

export const cancelTransfer = async ({
  id,
  reason,
}: {
  id: string
  reason?: string
}): Promise<ITransfer> => {
  const { data } = await api.post<SuccessResponse<ITransfer>>(
    `/transfers/${id}/cancel`,
    { cancellation_reason: reason },
  )

  return data.data
}
