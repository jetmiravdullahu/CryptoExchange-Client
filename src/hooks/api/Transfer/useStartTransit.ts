import { useMutation } from '@tanstack/react-query'
import { startTransit } from '@/api/Transfer/startTransit'

export const useStartTransitMutation = () => {
  return useMutation({
    mutationFn: startTransit,
  })
}