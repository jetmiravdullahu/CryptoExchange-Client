import { useMutation } from '@tanstack/react-query'
import { deleteLocation } from '@/api/Location/deleteLocation'

export const useDeleteLocationMutation = () => {
  return useMutation({
    mutationFn: deleteLocation,
  })
}
