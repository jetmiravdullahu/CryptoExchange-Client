import { useMutation } from '@tanstack/react-query'
import { deleteExchangeRate } from '@/api/ExchangeRate/deleteExchangeRate'

export const useDeleteExchangeRateMutation = () => {
  return useMutation({
    mutationFn: deleteExchangeRate,
  })
}
