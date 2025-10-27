import { useMutation } from '@tanstack/react-query'
import { confirmTransfer } from '@/api/Transfer/confirmTransfer'

export const useConfirmTransferMutation = () => {
  return useMutation({
    mutationFn: confirmTransfer,
  })
}