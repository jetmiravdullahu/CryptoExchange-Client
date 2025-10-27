import { useMutation } from '@tanstack/react-query'
import { timeoutTransaction } from '@/api/Transaction/timeoutTransaction'

export const useTimeoutTransactionMutation = () => {
  return useMutation({
    mutationFn: timeoutTransaction,
  })
}
