import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { LocationFeeFormData } from '@/types/locationFee'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LocationFeeFormDialog } from '@/components/Dashboard/LocationFees/LocationFeeFormModal'
import { LocationFeesTable } from '@/components/Dashboard/LocationFees/LocationFeesTable'
import {
  getLocationFeesQuery,
  useGetLocationFees,
} from '@/hooks/api/LocationFee/useGetLocationFees'
import { LoadingSpinner } from '@/components/LoadingComponent'

export const Route = createFileRoute(
  '/_auth/dashboard/_superadmin/locations/$location_id/fees',
)({
  component: RouteComponent,
  params: {
    parse: (params) => ({
      location_id: z.uuid().parse(params.location_id),
    }),
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      getLocationFeesQuery(params.location_id),
    )
  },
})

const initialLocationData: LocationFeeFormData = {
  id: '',
  fee_type: 'PCT',
  fee_value: 0,
  min_fee: undefined,
  max_fee: undefined,
  is_active: true,
}

function RouteComponent() {
  const { location_id } = Route.useParams()

  const [actionLocationFee, setActionLocationFee] =
    useState<LocationFeeFormData | null>(null)

  const { data, pagination, sorting, setPagination, setSorting } =
    useGetLocationFees(location_id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Location Fees Management
        </h2>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage location fees
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Locations</CardTitle>
              <CardDescription>
                Manage location information and settings
              </CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => setActionLocationFee(initialLocationData)}
            >
              <Plus className="h-4 w-4" />
              Add Location Fee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <LocationFeesTable
              locationFees={data.locationFees}
              totalLocationFees={data.pagination.total}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
            />
          </div>
        </CardContent>
      </Card>
      {actionLocationFee && (
        <LocationFeeFormDialog
          open={!!actionLocationFee}
          onOpenChange={setActionLocationFee}
          initialData={actionLocationFee}
          locationId={location_id}
        />
      )}
    </div>
  )
}
