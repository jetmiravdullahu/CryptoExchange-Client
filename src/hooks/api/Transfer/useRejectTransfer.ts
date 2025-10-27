import { useMutation } from '@tanstack/react-query'
import { rejectTransfer } from '@/api/Transfer/rejectTransfer'

export const useRejectTransferMutation = () => {
  return useMutation({
    mutationFn: rejectTransfer,
  })
}