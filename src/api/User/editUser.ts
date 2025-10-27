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

export const editUser = async ({
  id,
  ...input
}: {
  id: string
  name: string
  email: string
  password?: string
  password_confirmation?: string
  role: UserRole
  is_active: boolean
}): Promise<SuccessResponse<ILoginResponseData>> => {
  const { data } = await api.put<SuccessResponse<ILoginResponseData>>(
    `/users/${id}`,
    {
      id,
      name: input.name,
      email: input.email,
      role: input.role,
      is_active: input.is_active,
      ...(input.password && {
        password: input.password,
        password_confirmation: input.password_confirmation,
      }),
    },
  )

  return data
}
