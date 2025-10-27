import api from '..'
import type { AssetClass } from '@/types/asset'
import type { SuccessResponse } from '../types'

interface IAssetResponseData {
  id: string
  name: string
  code: string
  user_id: string | null
  is_active: boolean
  metadata: Array<any>
  created_at: string
  updated_at: string
}

export const createAsset = async (input: {
  code: string
  name: string
  asset_class: AssetClass 
  is_active: boolean
}): Promise<IAssetResponseData> => {
  const { data } = await api.post<SuccessResponse<IAssetResponseData>>(
    '/assets',
    input,
  )

  return data.data
}
