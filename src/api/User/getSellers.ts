import api from '..'
import type { SuccessResponse } from '../types'

interface IGetUsersResponseData {
    label: string
    value: string
}

export const getSellers = async (): Promise<
  SuccessResponse<Array<IGetUsersResponseData>>['data']
> => {
  const { data } = await api.get<SuccessResponse<Array<IGetUsersResponseData>>>(
    '/users/available-sellers',
  )
  return data.data
}
