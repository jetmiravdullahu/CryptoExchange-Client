import { useState } from 'react'
import { Plus } from 'lucide-react'

import { createFileRoute } from '@tanstack/react-router'

import z from 'zod'
import type { ExchangeRateFormData } from '@/types/exchangeRate'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import { LoadingSpinner } from '@/components/LoadingComponent'
import { ExchangeRatesTable } from '@/components/Dashboard/ExchangeRates/ExchangeRatesTable'
import { ExchangeRateFormDialog } from '@/components/Dashboard/ExchangeRates/ExchangeRateFormModal'
import {
  getExchangeRatesQuery,
  useGetExchangeRates,
} from '@/hooks/api/ExchangeRate/useGetExchangeRates'
import { getAssetOptionsQuery } from '@/hooks/api/Asset/useGetAssetOptionsQuery'

export const Route = createFileRoute(
  '/_auth/dashboard/_superadmin/assets/$asset_id/exchange-rates',
)({
  component: RouteComponent,
  params: {
    parse: (params) => ({
      asset_id: z.uuid().parse(params.asset_id),
    }),
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      getExchangeRatesQuery(params.asset_id),
    )
    context.queryClient.prefetchQuery(getAssetOptionsQuery)
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
})

const initialExchangeRateData: ExchangeRateFormData = {
  id: '',
  from_asset_id: "",
  to_asset_id: "",
  rate: 0,
  effective_from: null,
  effective_to: null,
  is_active: true,
}

function RouteComponent() {
  const { asset_id } = Route.useParams()
  const [actionExchangeRate, setActionExchangeRate] =
    useState<ExchangeRateFormData | null>(null)

  const { data, pagination, sorting, setPagination, setSorting } =
    useGetExchangeRates(asset_id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Exchange Rates Management
        </h2>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage exchange rates
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Exchange Rates</CardTitle>
              <CardDescription>
                Manage exchange rate information and settings
              </CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => setActionExchangeRate(initialExchangeRateData)}
            >
              <Plus className="h-4 w-4" />
              Add Exchange Rate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <ExchangeRatesTable
              exchangeRates={data.exchangeRates}
              totalExchangeRates={data.pagination.total}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
            />
          </div>
        </CardContent>
      </Card>
      {actionExchangeRate && (
        <ExchangeRateFormDialog
          open={!!actionExchangeRate}
          onOpenChange={setActionExchangeRate}
          initialData={actionExchangeRate}
          assetId={asset_id}
        />
      )}
    </div>
  )
}
