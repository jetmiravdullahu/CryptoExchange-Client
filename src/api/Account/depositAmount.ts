import api from '..'
import type { SuccessResponse } from '../types'

interface IDepositAmount {}

export const depositAmount = async ({
  account_id,
  ...rest
}: {
  account_id: string
  amount: string
  description: string
}): Promise<SuccessResponse<IDepositAmount>> => {
  const { data } = await api.post<SuccessResponse<IDepositAmount>>(
    `/accounts/${account_id}/deposit`,
    rest,
  )

  return data
}
