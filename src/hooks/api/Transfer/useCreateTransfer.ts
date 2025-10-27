import { useMutation } from '@tanstack/react-query'
import { createTransfer } from '@/api/Transfer/createTransfer'

export const useCreateTransferMutation = () => {
  return useMutation({
    mutationFn: createTransfer,
  })
}
