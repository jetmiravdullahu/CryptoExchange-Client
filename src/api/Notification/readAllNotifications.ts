import api from '..'
import type { SuccessResponse } from '../types'
import type { ITransfer } from '@/types/transfer'

export const readAllNotifications = async (): Promise<ITransfer> => {
  const { data } = await api.post<SuccessResponse<ITransfer>>(
    `/notifications/read-all`,
  )

  return data.data
}
