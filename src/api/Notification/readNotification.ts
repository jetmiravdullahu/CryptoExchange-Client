import api from '..'
import type { SuccessResponse } from '../types'
import type { ITransfer } from '@/types/transfer'

export const readNotification = async (id: string): Promise<ITransfer> => {
  const { data } = await api.post<SuccessResponse<ITransfer>>(
    `/notifications/${id}/read`,
  )

  return data.data
}
