import { useMutation } from '@tanstack/react-query'
import { editLocation } from '@/api/Location/editLocation'

export const useEditLocationMutation = () => {
  return useMutation({
    mutationFn: editLocation,
  })
}
