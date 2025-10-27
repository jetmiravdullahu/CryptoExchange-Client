import { useMutation } from '@tanstack/react-query'
import { login } from '../../../api/Auth/login'

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
  })
}
