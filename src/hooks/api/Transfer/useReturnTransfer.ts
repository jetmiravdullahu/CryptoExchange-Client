import { useMutation } from '@tanstack/react-query'
import { returnTransfer } from '@/api/Transfer/returnTransfer'

export const useReturnTransferMutation = () => {
  return useMutation({
    mutationFn: returnTransfer,
  })
}