import TransactionSummaryFilters from './TransactionSummaryFilters'
import { TransactionSummaryTable } from './TransactionSummaryTable'
import { CardContent } from '@/components/ui/card'
import { useGetTransactionSummary } from '@/hooks/api/Report/useGetTransactionSummary'

export const TransactionSummaryCard = () => {
  const {
    data: transactionSummaryData,
    filters,
    onSetFilters,
  } = useGetTransactionSummary()

  return (
    <CardContent>
      <div className='mb-10'>
        <TransactionSummaryFilters
          options={filters}
          onSetFilters={onSetFilters}
        />
      </div>
        <TransactionSummaryTable
          reports={transactionSummaryData.location_summaries}
        />
    </CardContent>
  )
}
