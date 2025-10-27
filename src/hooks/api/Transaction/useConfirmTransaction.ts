import { useMutation } from '@tanstack/react-query'
import { completeTransaction } from '@/api/Transaction/completeTransaction'

export const useCompleteTransactionMutation = () => {
  return useMutation({
    mutationFn: completeTransaction,
  })
}
