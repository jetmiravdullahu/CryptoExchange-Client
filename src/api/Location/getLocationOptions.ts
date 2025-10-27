import api from '..'
import type { SuccessResponse } from '../types'

export interface IGetLocationOptionsResponseData {
  label: string
  value: string
}

export const getLocationOptions = async (): Promise<
  SuccessResponse<Array<IGetLocationOptionsResponseData>>['data']
> => {
  const { data } = await api.get<
    SuccessResponse<Array<IGetLocationOptionsResponseData>>
  >('/locations/for-select')
  return data.data
}
