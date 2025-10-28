import api from '..'
import type { SuccessResponse } from '../types'

export interface IGetAccountOptionsResponseData {
  label: string
  value: string
}

export const getAccountOptions = async (): Promise<
  SuccessResponse<Array<IGetAccountOptionsResponseData>>['data']
> => {
  const { data } = await api.get<
    SuccessResponse<Array<IGetAccountOptionsResponseData>>
  >('/accounts/for-select')
  return data.data
}
