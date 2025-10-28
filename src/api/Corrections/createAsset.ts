import api from '..'
import type { SuccessResponse } from '../types'
import type { CorrectionFormData } from '@/types/correction'

interface ICorrectionResponseData {}

export const createCorrection = async (
  input: CorrectionFormData,
): Promise<ICorrectionResponseData> => {
  const { data } = await api.post<SuccessResponse<ICorrectionResponseData>>(
    '/corrections',
    input,
  )

  return data.data
}
