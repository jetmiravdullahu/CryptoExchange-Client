import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { AccountTransactionInput } from '@/types/account'
import { LoadingSpinner } from '@/components/LoadingComponent'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  getAccountsQuery,
  useGetAccountsQuery,
} from '@/hooks/api/Account/useGetAccounts'
import { AccountsTable } from '@/components/Dashboard/Accounts/AccountsTable'
import { AccountTransactionModal } from '@/components/Dashboard/Accounts/AccountTransactionModal'

export const Route = createFileRoute('/_auth/dashboard/accounts')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getAccountsQuery)
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
})
function RouteComponent() {
  const { data } = useGetAccountsQuery()

  const [transactionData, setTransactionData] =
    useState<AccountTransactionInput | null>(null)

  const onClose = () => {
    setTransactionData(null)
  }

  const openTransactionDataModal = ({
    type,
    account_id,
    current_balance
  }: Pick<AccountTransactionInput, 'type' | 'account_id' | 'current_balance'>) => {
    setTransactionData({
      type,
      amount: '0',
      account_id,
      current_balance,
      description: '',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Accounts Management
        </h2>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage accounts
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Accounts</CardTitle>
              <CardDescription>Manage account permissions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <AccountsTable
              accounts={data}
              openTransactionDataModal={openTransactionDataModal}
            />
          </div>
        </CardContent>
      </Card>
      {transactionData && (
        <AccountTransactionModal
          isOpen={!!transactionData}
          onClose={onClose}
          transaction={transactionData}
        />
      )}
    </div>
  )
}
