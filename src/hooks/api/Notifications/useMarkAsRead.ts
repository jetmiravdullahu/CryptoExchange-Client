import { useMutation } from '@tanstack/react-query'
import { readNotification } from '@/api/Notification/readNotification'

export const useMarkAsReadMutation = () => {
  return useMutation({
    mutationFn: readNotification,
    onMutate: () => {},
    onSuccess: () => {},
    onError: () => {},
  })
}
