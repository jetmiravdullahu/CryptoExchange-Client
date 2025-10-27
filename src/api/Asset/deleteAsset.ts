import api from '..'
import type { SuccessResponse } from '../types'

interface IDeleteAssetResponseData {
  id: string
  name: string
  code: string
}

export const deleteAsset = async (input: {
  id: string
}): Promise<SuccessResponse<IDeleteAssetResponseData>> => {
  const { data } = await api.delete<SuccessResponse<IDeleteAssetResponseData>>(
    `/assets/${input.id}`,
  )

  return data
}
