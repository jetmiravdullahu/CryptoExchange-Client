import { useMutation } from '@tanstack/react-query'
import { createLocation } from '@/api/Location/createLocation'

export const useCreateLocationMutation = () => {
  
  return useMutation({
    mutationFn: createLocation
  })
}
