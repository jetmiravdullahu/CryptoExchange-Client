import api from '..'
import type { SuccessResponse } from '../types'

interface IWithdrawAmount {}

export const withdrawAmount = async ({
  account_id,
  ...rest
}: {
  account_id: string
  amount: string
  description: string
}): Promise<SuccessResponse<IWithdrawAmount>> => {
  const { data } = await api.post<SuccessResponse<IWithdrawAmount>>(
    `/accounts/${account_id}/withdraw`,
    rest,
  )

  return data
}
