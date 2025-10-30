import { useState } from 'react'
import { Plus } from 'lucide-react'

import { createFileRoute } from '@tanstack/react-router'
import type { LocationFormData } from '@/types/location'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getLocationsQuery,
  useGetLocations,
} from '@/hooks/api/Location/useGetLocations'
import { LocationsTable } from '@/components/Dashboard/Locations/LocationsTable'
import { LocationFormDialog } from '@/components/Dashboard/Locations/LocationFormModal'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import { LoadingSpinner } from '@/components/LoadingComponent'
import { getSellersQuery } from '@/hooks/api/User/useGetSellers'

export const Route = createFileRoute('/_auth/dashboard/locations/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getLocationsQuery())
    context.queryClient.prefetchQuery(getSellersQuery)
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
})

const initialLocationData: LocationFormData = {
  id: '',
  name: '',
  address: '',
  code: '',
  city: '',
  user: {
    id: '',
    name: '',
  },
  is_active: true,
  fee_type: 'PCT',
  fee_value: '0',
}

function RouteComponent() {
  const [actionLocation, setActionLocation] = useState<LocationFormData | null>(
    null,
  )

  const { data, pagination, sorting, setPagination, setSorting } =
    useGetLocations()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Locations Management
        </h2>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage locations
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
              onClick={() => setActionLocation(initialLocationData)}
            >
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <LocationsTable
              locations={data.data}
              setActionLocation={setActionLocation}
              totalLocations={data.total}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
            />
          </div>
        </CardContent>
      </Card>
      {actionLocation && (
        <LocationFormDialog
          open={!!actionLocation}
          onOpenChange={setActionLocation}
          initialData={actionLocation}
          isEdit={!!actionLocation.id}
        />
      )}
    </div>
  )
}
