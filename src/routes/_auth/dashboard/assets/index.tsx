import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { AssetFormData } from '@/types/asset'
import { getAssetsQuery, useGetAssets } from '@/hooks/api/Asset/useGetAssets'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AssetFormDialog } from '@/components/Dashboard/Assets/AssetFormModal'
import { AssetsTable } from '@/components/Dashboard/Assets/AssetsTable'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import { LoadingSpinner } from '@/components/LoadingComponent'

export const Route = createFileRoute('/_auth/dashboard/assets/')({
  component: AssetsRoute,
  errorComponent: PostErrorComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getAssetsQuery(),
    )
  },
  pendingComponent: LoadingSpinner
})

const initialAssetData: AssetFormData = {
  id: '',
  name: '',
  code: '',
  asset_class: 'CRYPTO',
  is_active: true,
}

function AssetsRoute() {
  const [actionAsset, setActionAsset] = useState<AssetFormData | null>(null)

  const { data, pagination, sorting, setPagination, setSorting } = useGetAssets()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Assets Management
        </h2>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage assets
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Assets</CardTitle>
              <CardDescription>
                Manage asset information and settings
              </CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => setActionAsset(initialAssetData)}
            >
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <AssetsTable
              assets={data.assets}
              setActionAsset={setActionAsset}
              totalAssets={data.pagination.total}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
            />
          </div>
        </CardContent>
      </Card>
      {actionAsset && (
        <AssetFormDialog
          open={!!actionAsset}
          onOpenChange={setActionAsset}
          initialData={actionAsset}
          isEdit={!!actionAsset.id}
        />
      )}
    </div>
  )
}
