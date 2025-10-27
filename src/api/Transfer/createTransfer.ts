import api from '..'
import type { SuccessResponse } from '../types'
import type { ITransfer, TransferFormData } from '@/types/transfer'

export const createTransfer = async (
  input: TransferFormData,
): Promise<ITransfer> => {
  const { data } = await api.post<SuccessResponse<ITransfer>>(
    '/transfers',
    input,
  )

  return data.data
}
