import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import dayjs from 'dayjs'
import { getTransactionSummary } from '@/api/Reports/getTransactionSummary'

interface FilterState {
  from: string
  to: string
  asset_id?: string
  location_ids?: Array<string>
}

export const getTransactionSummaryQuery = (opts?: { filters: FilterState }) => 
  queryOptions({
    queryKey: [
      'getTransactionSummary',
      opts || {
        filters: initialFilters,
      },
    ],
    queryFn: () =>
      getTransactionSummary(
        opts || {
          filters: initialFilters,
        },
      ),
  })

const initialFilters = {
  from: dayjs().startOf('month').format('YYYY-MM-DD'),
  to: dayjs().format('YYYY-MM-DD'),
}

export const useGetTransactionSummary = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const onSetFilters = (key: string, value?: string | Array<string>) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const { data } = useSuspenseQuery(
    getTransactionSummaryQuery({
      filters,
    }),
  )

  return {
    data,
    filters,
    onSetFilters,
  }
}
