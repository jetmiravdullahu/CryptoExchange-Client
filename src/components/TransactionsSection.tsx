import { TransactionsTable } from './Dashboard/Transactions/TransactionsTable'
import TableFilters from './TableFilters'
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
    filters,
    onSetFilters,
  } = useGetTransactions()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription className="mb-4">
              Manage transactions and permissions
            </CardDescription>
          </div>
        </div>
        <TableFilters options={filters} onSetFilters={onSetFilters} />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border px-4">
          <TransactionsTable
            totalTransactions={transactionsData.total}
            transactions={transactionsData.data}
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
