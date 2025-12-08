import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { ITransaction } from '@/types/transaction'
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
import { Button } from '@/components/ui/button'
import { TransactionFormDialog } from '@/components/Dashboard/Transactions/TransactionFormModal'
import { getLocationOptionsQuery } from '@/hooks/api/Location/useGetLocationOptionsQuery'
import { getAssetOptionsQuery } from '@/hooks/api/Asset/useGetAssetOptionsQuery'
import { TransactionDetailsModal } from '@/components/Dashboard/Transactions/TransactionDetailsModal'

export const Route = createFileRoute('/_auth/dashboard/transactions')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getTransactionsQuery())
    context.queryClient.prefetchQuery(getLocationOptionsQuery)
    context.queryClient.prefetchQuery(getAssetOptionsQuery)
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
    filters,
    onSetFilters,
  } = useGetTransactions()

  const [open, setOpen] = useState(false)

  const [transactionDetails, setTransactionDetails] =
    useState<null | ITransaction>(null)

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
              <CardDescription className="mb-4">
                Manage transactions and permissions
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Transaction
            </Button>
          </div>
          <TableFilters
            options={filters}
            onSetFilters={onSetFilters}
          />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <TransactionsTable
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
              totalTransactions={transactionsData.total}
              transactions={transactionsData.data}
              onRowClick={setTransactionDetails}
            />
          </div>
        </CardContent>
      </Card>
      {open && <TransactionFormDialog open={open} onOpenChange={setOpen} />}
      {transactionDetails && (
        <TransactionDetailsModal
          transaction={transactionDetails}
          open={!!transactionDetails}
          onClose={() => setTransactionDetails(null)}
        />
      )}
    </div>
  )
}
