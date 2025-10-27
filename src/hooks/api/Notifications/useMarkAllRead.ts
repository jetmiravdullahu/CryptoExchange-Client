import { useMutation } from '@tanstack/react-query'
import { readAllNotifications } from '@/api/Notification/readAllNotifications'

export const useMarkAllReadMutation = () => {
  return useMutation({
    mutationFn: readAllNotifications,
  })
}
