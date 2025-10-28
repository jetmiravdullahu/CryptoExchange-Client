import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { CorrectionFormData } from '@/types/correction'
import { LoadingSpinner } from '@/components/LoadingComponent'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getCorrectionsQuery,
  useGetCorrections,
} from '@/hooks/api/Correction/useGetCorrections'
import { CorrectionsTable } from '@/components/Dashboard/Corrections/CorrectionsTable'
import { CorrectionFormDialog } from '@/components/Dashboard/Corrections/CorrectionFormModal'
import { getAccountOptionsQuery } from '@/hooks/api/Account/useGetAccountOptionsQuery'

export const Route = createFileRoute('/_auth/dashboard/corrections')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getCorrectionsQuery())
    context.queryClient.prefetchQuery(getAccountOptionsQuery)
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
})

const initialData: CorrectionFormData = {
  account_id: '',
  amount: '',
  correction_type: 'DEBIT',
  reason: '',
}

function RouteComponent() {
  const [actionCorrection, setActionCorrection] =
    useState<CorrectionFormData | null>(null)

  const { data, pagination, sorting, setPagination, setSorting } =
    useGetCorrections()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Corrections Management
        </h2>
        <p className="text-muted-foreground mt-2">Manage user corrections</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Corrections</CardTitle>
              <CardDescription>
                Manage user corrections and adjustments
              </CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => setActionCorrection(initialData)}
            >
              <Plus className="h-4 w-4" />
              Add Correction
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <CorrectionsTable
              corrections={data.data}
              totalCorrections={data.total}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
            />
          </div>
        </CardContent>
      </Card>
      {actionCorrection && (
        <CorrectionFormDialog
          open={!!actionCorrection}
          onOpenChange={setActionCorrection}
          initialData={actionCorrection}
        />
      )}
    </div>
  )
}
