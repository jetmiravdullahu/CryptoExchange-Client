import { useMutation } from '@tanstack/react-query'
import { depositAmount } from '@/api/Account/depositAmount'

export function useDepositAmountMutation() {
  return useMutation({
    mutationFn: depositAmount,
  })
}
