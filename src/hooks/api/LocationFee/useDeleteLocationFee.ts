import { useMutation } from '@tanstack/react-query'
import { deleteLocationFee } from '@/api/LocationFee/deleteLocationFee'

export const useDeleteLocationFeeMutation = () => {
  return useMutation({
    mutationFn: deleteLocationFee,
  })
}
