import { createFileRoute } from '@tanstack/react-router'
import { TransactionsTable } from '@/components/Dashboard/Transactions/TransactionsTable'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  getTransactionsQuery,
  useGetTransactions,
} from '@/hooks/api/Transaction/useGetTransactions'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import { LoadingSpinner } from '@/components/LoadingComponent'
import TableFilters from '@/components/TableFilters'

export const Route = createFileRoute('/_auth/dashboard/transactions')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getTransactionsQuery())
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
})

function RouteComponent() {
  const {
    data: transactionsData,
    pagination,
    setPagination,
    setSorting,
    sorting,
  } = useGetTransactions()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Transactions Management
        </h2>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription className='mb-4'>
                Manage transactions and permissions
              </CardDescription>
                <TableFilters options={{}} onSetFilters={() => {}} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <TransactionsTable
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
              totalTransactions={transactionsData.pagination.total}
              transactions={transactionsData.transactions}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
