import { useMutation } from '@tanstack/react-query'
import { cancelTransaction } from '@/api/Transaction/cancelTransaction'

export const useCancelTransactionMutation = () => {
  return useMutation({
    mutationFn: cancelTransaction,
    onSuccess: () => {},
    onMutate: () => {},
    onError: () => {},
  })
}
