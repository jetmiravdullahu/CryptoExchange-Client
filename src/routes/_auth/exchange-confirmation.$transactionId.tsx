import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import z from 'zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import ErrorAnimation from '@/components/TradeAnimations/ErrorAnimation'
import SuccessAnimation from '@/components/TradeAnimations/SuccessAnimation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/LoadingComponent'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import { getTransactionQuery } from '@/hooks/api/Transaction/useGetTransaction'
import { TimerComponent } from '@/components/TimerComponent'
import { useCancelTransactionMutation } from '@/hooks/api/Transaction/useCancelTransaction'
import { useCompleteTransactionMutation } from '@/hooks/api/Transaction/useConfirmTransaction'
import { useTimeoutTransactionMutation } from '@/hooks/api/Transaction/useTimeoutTransaction'
import { getAccountsQuery } from '@/hooks/api/Account/useGetAccounts'
import { getTransactionsQuery } from '@/hooks/api/Transaction/useGetTransactions'

export const Route = createFileRoute(
  '/_auth/exchange-confirmation/$transactionId',
)({
  component: RouteComponent,
  pendingComponent: LoadingSpinner,
  params: {
    parse: (params) => ({
      transactionId: z.uuid().parse(params.transactionId),
    }),
  },
  errorComponent: PostErrorComponent,
  validateSearch: (search) => search,
  loader: async ({ context, params }) => {
    const { transactionId } = params

    const data = await context.queryClient.ensureQueryData(
      getTransactionQuery(transactionId),
    )

    if (data.status !== 'PENDING') {
      throw redirect({
        to: '/',
      })
    }

    return data
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const exchangeData = Route.useLoaderData()
  const queryClient = useQueryClient()

  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const { mutate: completeMutation } = useCompleteTransactionMutation()
  const { mutateAsync: cancelMutation } = useCancelTransactionMutation()
  const { mutate: timeoutMutation } = useTimeoutTransactionMutation()

  const [expired, setExpired] = useState(false)

  const handleExpire = () => {
    timeoutMutation(
      {
        transactionId: exchangeData.id,
      },
      {
        onSuccess: async () => {
          toast.error('Transaction cancelled due to time expiration.')
          await queryClient.invalidateQueries({
            queryKey: getTransactionsQuery().queryKey,
          })
        },
      },
    )
    setExpired(true)
  }

  const handleConfirm = () => {
    if (expired) return

    completeMutation(exchangeData.id, {
      onSuccess: async () => {
        setShowSuccess(true)
        setTimeout(() => {
          navigate({ to: '/' })
        }, 3000)
        await queryClient.invalidateQueries({
          queryKey: getAccountsQuery.queryKey,
        })
        await queryClient.invalidateQueries({
          queryKey: getTransactionsQuery().queryKey,
        })
      },
      onError: () => {
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
        }, 3000)
      },
    })
  }

  const handleCancel = async () => {
    console.log({ expired })
    if (expired) return
    await cancelMutation(
      {
        transactionId: exchangeData.id,
        cancellation_reason: 'User Cancelled',
      },
      {
        onSuccess: async () => {
          toast.success('Transaction cancelled successfully.')
          await queryClient.invalidateQueries({
            queryKey: getTransactionsQuery().queryKey,
          })
        },
      },
    )
    navigate({ to: '/' })
  }

  return (
    <>
      {showSuccess && <SuccessAnimation />}
      {showError && <ErrorAnimation />}

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Review Exchange Details
                </CardTitle>
                <CardDescription>
                  Please review your exchange before confirming
                </CardDescription>
              </div>
              {!showSuccess && !showError && (
                <TimerComponent initialTime={300} onExpire={handleExpire} />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="text-center flex-1">
                  <p className="text-sm text-muted-foreground mb-1">You Send</p>
                  <p className="text-2xl font-bold">
                    {parseFloat(exchangeData.from_amount).toFixed(2)}{' '}
                    {exchangeData.from_asset.name}
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground mx-4" />
                <div className="text-center flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    You Receive
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {parseFloat(exchangeData.to_amount).toFixed(2)}{' '}
                    {exchangeData.to_asset.name}
                  </p>
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="font-medium">
                  1 {exchangeData.from_asset.name} ={' '}
                  {parseFloat(exchangeData.rate_value).toFixed(2)}{' '}
                  {exchangeData.to_asset.name}
                </span>
              </div>

              {/* Tax */}
              <div className="flex items-center justify-between py-3 border-b bg-primary/10 px-4 rounded-lg">
                <span className="text-foreground">
                  Location Fee (
                  {exchangeData.fee_basis_type === 'PCT'
                    ? `${parseFloat(exchangeData.fee_basis_value).toFixed(2)}%`
                    : 'Flat'}
                  )
                </span>
                <span className="font-medium text-destructive">
                  - {parseFloat(exchangeData.fee_flat).toFixed(2)}{' '}
                  {exchangeData.from_asset.name}
                </span>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Important Notice
                </p>
                <p className="text-sm text-muted-foreground">
                  Once confirmed, this transaction cannot be reversed. Please
                  verify all details before proceeding.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleCancel}
                className="h-12 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                size="lg"
                disabled={expired}
                onClick={handleConfirm}
                className="h-12"
              >
                Confirm Trade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
