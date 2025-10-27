import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import type { SuccessResponse } from '@/api/types'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
      mutations: {
        onMutate: () => {
          const toastId = toast.loading('Processing...')

          return { toastId }
        },
        onError: (error, _vars, context) => {
          const contextData = context as { toastId: string }
          if (!contextData.toastId) return
          const err = error as AxiosError<any>

          toast.error(
            err.response?.data?.message ||
              'Something went wrong. Please try again.',
            {
              id: contextData.toastId,
            },
          )
        },
        onSuccess(data, _vars, context) {
          const contextData = context as { toastId: string }
          if (!contextData.toastId) return
          const res = data as SuccessResponse<any>

          toast.success(res.message || 'Operation successful', {
            id: contextData.toastId,
          })
        },
      },
    },
  })
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
