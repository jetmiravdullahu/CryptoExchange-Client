import { useMutation } from '@tanstack/react-query'
import { cancelTransfer } from '@/api/Transfer/cancelTransfer'

export const useCancelTransferMutation = () => {
  return useMutation({
    mutationFn: cancelTransfer,
  })
}