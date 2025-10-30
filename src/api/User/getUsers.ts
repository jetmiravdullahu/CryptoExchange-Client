import api from '..'
import type { UserRole } from '@/types/user'
import type { PaginatedResponse } from '../types'
import type { ILocation } from '@/types/location'

interface IGetUsersResponseData {
  id: string
  email: string
  name: string
  role: UserRole
  location_id: string | null
  location?: ILocation
  is_active: boolean
  email_verified_at: string | null
  last_login_at: string | null
  metadata: Array<any>
  created_at: string
  updated_at: string
  phone?: string
  department?: string
}

export const getUsers = async (opts?: {
  pagination: { pageIndex: number; pageSize: number }
  sorting: Array<{ id: string; desc: boolean }>
}): Promise<PaginatedResponse<IGetUsersResponseData>['data']> => {
  const { data } = await api.get<PaginatedResponse<IGetUsersResponseData>>(
    '/users',
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
