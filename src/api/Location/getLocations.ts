import api from '..'
import type { UserRole } from '@/types/user'
import type { PaginatedResponse } from '../types'

interface IGetLocationsResponseData {
  id: string
  code: string
  name: string
  address: string
  city: string
  country_code: string
  timezone: string
  is_active: boolean
  metadata: Array<any>
  created_at: string
  updated_at: string
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    location_id: string
    is_active: boolean
    email_verified_at: string | null
    last_login_at: string | null
    created_at: string
    updated_at: string
  }
}

export const getLocations = async (opts?: {
  pagination: { pageIndex: number; pageSize: number }
  sorting: Array<{ id: string; desc: boolean }>
}): Promise<PaginatedResponse<IGetLocationsResponseData>['data']> => {
  const { data } = await api.get<PaginatedResponse<IGetLocationsResponseData>>(
    '/locations',
    opts && {
      params: {
        per_page: opts.pagination.pageSize,
        page: opts.pagination.pageIndex + 1,
        sort: opts.sorting[0].id,
        direction: opts.sorting[0].desc ? 'desc' : 'asc',
      },
    },
  )
  return data.data
}
