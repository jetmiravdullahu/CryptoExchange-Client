import { createFileRoute } from '@tanstack/react-router'
import { TransfersSection } from '@/components/TransfersSection'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import { LoadingSpinner } from '@/components/LoadingComponent'
import { getTransfersQuery } from '@/hooks/api/Transfer/useGetTransfers'
import { getAssetOptionsQuery } from '@/hooks/api/Asset/useGetAssetOptionsQuery'
import { getLocationOptionsQuery } from '@/hooks/api/Location/useGetLocationOptionsQuery'

export const Route = createFileRoute('/_auth/dashboard/transfers')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getTransfersQuery())
    context.queryClient.prefetchQuery(getAssetOptionsQuery)
    context.queryClient.prefetchQuery(getLocationOptionsQuery)
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
})

function RouteComponent() {
  return (
    <>
      <TransfersSection />
    </>
  )
}
