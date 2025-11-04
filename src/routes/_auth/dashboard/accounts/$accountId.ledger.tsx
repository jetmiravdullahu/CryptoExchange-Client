import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { BarChart3, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingComponent'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import {
  getAccountLedgerQuery,
  useGetAccountLedger,
} from '@/hooks/api/AccountLedger/useGetAccountLedger'
import {
  getAccountLedgerStatsQuery,
  useGetAccountLedgerStats,
} from '@/hooks/api/AccountLedger/useGetAccountLedgerStats'
import { AccountLedgersTable } from '@/components/Dashboard/AccountLedgers/AccountLedgersTable'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import TableFilters from '@/components/TableFilters'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { LedgerStats } from '@/components/Dashboard/Accounts/LedgerStats'
import { cn } from '@/lib/utils'

export const Route = createFileRoute(
  '/_auth/dashboard/accounts/$accountId/ledger',
)({
  component: RouteComponent,
  pendingComponent: LoadingSpinner,
  params: {
    parse: (params) => ({
      accountId: z.uuid().parse(params.accountId),
    }),
  },
  errorComponent: PostErrorComponent,
  validateSearch: (search) => search,
  loader: async ({ context, params }) => {
    const { accountId } = params

    await context.queryClient.ensureQueryData(getAccountLedgerQuery(accountId))

    await context.queryClient.ensureQueryData(
      getAccountLedgerStatsQuery(accountId),
    )
  },
})

function RouteComponent() {
  const { accountId } = Route.useParams()

  const {
    data: ledgerData,
    pagination,
    setPagination,
    setSorting,
    sorting,
    filters,
    onSetFilters,
  } = useGetAccountLedger(accountId)
  const { data: ledgerStatsData } = useGetAccountLedgerStats(accountId)

  const [open, setOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Account Ledger
          </h1>
          <p className="text-sm text-muted-foreground">
            {ledgerStatsData.account.owner_type} -{' '}
            {ledgerStatsData.account.asset_name}
          </p>
        </div>

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className={cn(open && 'mb-4')} asChild>
            <Button variant={'secondary'}>
              {open ? (
                <span className="mr-2 flex items-center gap-3">
                  Hide Stats
                  <EyeOff />
                </span>
              ) : (
                <span className="mr-2 flex items-center gap-3">
                  Show Stats
                  <BarChart3 />
                </span>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <LedgerStats />
          </CollapsibleContent>
        </Collapsible>

        <TableFilters options={filters} onSetFilters={onSetFilters} />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Account Ledgers</CardTitle>
                <CardDescription>View account ledgers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border px-4">
              <AccountLedgersTable
                accountLedgers={ledgerData.data}
                totalAccountLedgers={ledgerData.total}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
