import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { TransactionsTable } from '@/components/Dashboard/Transactions/TransactionsTable'
import { Button } from '@/components/ui/button'
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
              <CardDescription>
                Manage transactions and permissions
              </CardDescription>
            </div>
            <Button
              className="gap-2"
              // onClick={() => setActionUser(initialUserData)}
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
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
      {/* {actionUser && (
        <UserFormDialog
          open={!!actionUser}
          onOpenChange={setActionUser}
          initialData={{
            ...actionUser,
            password: '',
            password_confirmation: '',
          }}
          isEdit={!!actionUser.id}
        />
      )} */}
    </div>
  )
}
