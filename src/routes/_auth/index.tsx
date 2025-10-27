import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { TradingDashboard } from '@/components/TradingDashboard'
import {
  currentUserQuery,
  useGetCurrentUser,
} from '@/hooks/api/Auth/useGetCurrentUser'
import { getAssetOptionsQuery } from '@/hooks/api/Asset/useGetAssetOptionsQuery'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import { LoadingSpinner } from '@/components/LoadingComponent'
import { getCurrentLocationFeeQuery } from '@/hooks/api/LocationFee/useGetCurrentLocationFee'
import { SellerHeader } from '@/components/SellerHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTransactionsQuery } from '@/hooks/api/Transaction/useGetTransactions'
import { getAccountsQuery } from '@/hooks/api/Account/useGetAccounts'
import { TransfersSection } from '@/components/TransfersSection'
import { getLocationOptionsQuery } from '@/hooks/api/Location/useGetLocationOptionsQuery'

export const Route = createFileRoute('/_auth/')({
  component: App,
  beforeLoad: ({ context }) => {
    const cachedUser = context.queryClient.getQueryData(
      currentUserQuery.queryKey,
    )?.user

    if (!cachedUser)
      throw redirect({
        to: '/login',
      })

    if (cachedUser.role !== 'SELLER')
      throw redirect({
        to: '/dashboard',
      })
  },
  loader: async ({ context }) => {
    const cachedUser = context.queryClient.getQueryData(
      currentUserQuery.queryKey,
    )?.user

    if (!cachedUser) throw redirect({ to: '/login' })

    await context.queryClient.ensureQueryData(getCurrentLocationFeeQuery())

    await context.queryClient.ensureQueryData(getAccountsQuery)

    context.queryClient.prefetchQuery(getAssetOptionsQuery)
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
})

function App() {
  const queryClient = useQueryClient()
  const { data: user } = useGetCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <SellerHeader />

        <Tabs defaultValue="transactions">
          <TabsList className="mb-5 py-5">
            <TabsTrigger className="text-lg p-4" value="transactions">
              Transactions
            </TabsTrigger>
            <TabsTrigger
              className="text-lg p-4"
              value="transfers"
              onMouseEnter={() => {
                queryClient.prefetchQuery(getLocationOptionsQuery)
                queryClient.prefetchQuery(
                  getTransactionsQuery(user.user.location_id),
                )
              }}
            >
              Transfers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <TradingDashboard />
          </TabsContent>
          <TabsContent value="transfers">
            <TransfersSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
