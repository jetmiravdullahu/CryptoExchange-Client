import api from '..'
import type { AssetClass } from '@/types/asset'
import type { SuccessResponse } from '../types'

export interface IGetAssetOptionsResponseData {
  label: string
  value: string
  class: AssetClass
}

export const getAssetOptions = async (): Promise<
  SuccessResponse<Array<IGetAssetOptionsResponseData>>['data']
> => {
  const { data } = await api.get<
    SuccessResponse<Array<IGetAssetOptionsResponseData>>
  >('/assets/for-select')
  return data.data
}
