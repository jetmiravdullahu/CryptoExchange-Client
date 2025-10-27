import { useMutation } from '@tanstack/react-query'
import { withdrawAmount } from '@/api/Account/withdrawAmount'

export function useWithdrawAmountMutation() {
  return useMutation({
    mutationFn: withdrawAmount,
  })
}
