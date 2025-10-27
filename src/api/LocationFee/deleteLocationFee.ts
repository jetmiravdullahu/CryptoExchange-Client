import api from '..'

import type { UserRole } from '@/types/user'
import type { SuccessResponse } from '../types'

interface ILoginResponseData {
  token: string
  token_type: string
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    location_id: string | null
    is_active: boolean
    email_verified_at: string | null
    last_login_at: string | null
    metadata: Array<any>
    created_at: string
    updated_at: string
  }
}

export const deleteLocationFee = async (input: {
  id: string
}): Promise<SuccessResponse<ILoginResponseData>> => {
  const { data } = await api.delete<SuccessResponse<ILoginResponseData>>(
    `/location-fees/${input.id}`,
  )

  return data
}
