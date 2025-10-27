import { useMutation } from '@tanstack/react-query'
import { createExchangeRate } from '@/api/ExchangeRate/createExchangeRate'

export const useCreateExchangeRateMutation = () => {
  return useMutation({
    mutationFn: createExchangeRate,
  })
}
