import { useMutation } from '@tanstack/react-query'
import { createTransaction } from '@/api/Transaction/createTransaction'

export const useCreateTransactionMutation = () => {
  return useMutation({
    mutationFn: createTransaction,
  })
}
