import api from '..'
import type { IReport } from '@/types/report'
import type {  SuccessResponse } from '../types'

export const getTransactionSummary = async (opts?: {
  filters?: {
    from?: string
    to?: string
    asset_id?: string
    location_ids?: Array<string>
  }
}): Promise<SuccessResponse<IReport>['data']> => {

  const { data } = await api.get<SuccessResponse<IReport>>(
    '/reports/transaction-summary',
    opts && {
      params: {
        from: opts.filters?.from,
        to: opts.filters?.to,
        asset_id: opts.filters?.asset_id,
        location_ids: opts.filters?.location_ids,
      },
    },
  )
  return data.data
}
