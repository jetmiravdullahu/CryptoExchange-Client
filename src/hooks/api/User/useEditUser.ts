import { useMutation } from '@tanstack/react-query'
import { editUser } from '@/api/User/editUser'

export const useEditUserMutation = () => {
  return useMutation({
    mutationFn: editUser,
  })
}
