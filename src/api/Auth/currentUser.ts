import api from '..'
import type { UserRole } from '@/types/user'
import type { SuccessResponse } from '../types'

interface ICurrentUserResponseData {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    location_id: string
    is_active: boolean
    email_verified_at: string | null
    last_login_at: string | null
    metadata: Array<any>
    created_at: string
    updated_at: string
  }
  session: {
    token: string
    ip_address: string
    user_agent: string
    last_activity: string
  }
}

export const getCurrentUser = async (): Promise<ICurrentUserResponseData> => {
  const { data } =
    await api.get<SuccessResponse<ICurrentUserResponseData>>('/auth/me')

  return data.data
}
