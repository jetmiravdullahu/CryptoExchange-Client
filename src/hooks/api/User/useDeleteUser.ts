import { useMutation } from '@tanstack/react-query'
import { deleteUser } from '@/api/User/deleteUser'

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: deleteUser,
  })
}
