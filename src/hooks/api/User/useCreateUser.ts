import { useMutation } from '@tanstack/react-query'
import { createUser } from '@/api/User/createUser'

export const useCreateUserMutation = () => {
  
  return useMutation({
    mutationFn: createUser
  })
}
