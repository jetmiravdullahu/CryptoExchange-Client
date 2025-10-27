import api from '..'
import type { SuccessResponse } from '../types'
import type { ITransfer } from '@/types/transfer'

export const returnTransfer = async ({
  id,
  reason,
}: {
  id: string
  reason: string
}): Promise<ITransfer> => {
  const { data } = await api.post<SuccessResponse<ITransfer>>(
    `/transfers/${id}/return`,
    { return_reason: reason },
  )

  return data.data
}
