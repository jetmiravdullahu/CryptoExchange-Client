import { TransactionsTable } from './Dashboard/Transactions/TransactionsTable'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { useGetTransactions } from '@/hooks/api/Transaction/useGetTransactions'

export const TransactionsSection = () => {
  const {
    data: transactionsData,
    pagination,
    setPagination,
    setSorting,
    sorting,
  } = useGetTransactions()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              Manage transaction information and settings
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border px-4">
          <TransactionsTable
            totalTransactions={transactionsData.pagination.total}
            transactions={transactionsData.transactions}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
          />
        </div>
      </CardContent>
    </Card>
  )
}
