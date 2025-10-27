import api from '..'
import type { Account } from '@/types/account'
import type { SuccessResponse } from '../types'

export const getAccounts = async (): Promise<
  SuccessResponse<Array<Account>>['data']
> => {
  const { data } = await api.get<SuccessResponse<Array<Account>>>(`/accounts`)

  return data.data
}
  