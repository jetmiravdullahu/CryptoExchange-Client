import { useMutation } from '@tanstack/react-query'
import { createLocationFee } from '@/api/LocationFee/createLocationFee'

export const useCreateLocationFeeMutation = () => {
  return useMutation({
    mutationFn: createLocationFee,
  })
}
