import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getTransaction } from '@/api/Transaction/getTransaction'

export const getTransactionQuery = (transactionId: string) =>
  queryOptions({
    queryKey: ['getTransaction', transactionId],
    queryFn: () => getTransaction(transactionId),
    retry: (failureCount, error: any) => {
      if (error?.response?.data?.success === false) return false
      return failureCount < 3
    },
  })

export const useGetTransactionQuery = (transactionId: string) => {
  return useSuspenseQuery(getTransactionQuery(transactionId))
}
