import { z } from 'zod'
import type { ILocation } from './location'

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'SELLER'

export const UserSchema = z
  .object({
    id: z.union([z.uuid(), z.string().optional()]),
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email'),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    role: z.enum(['SELLER', 'ADMIN', 'SUPER_ADMIN']),
    is_active: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const isEdit = !!data.id
    const hasPassword = !!data.password

    if (!isEdit) {
      if (!hasPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Password is required',
          path: ['password'],
        })
      } else if (data.password!.length < 6) {
        ctx.addIssue({
          code: 'custom',
          message: 'Password must be at least 6 characters',
          path: ['password'],
        })
      }
    } else {
      if (hasPassword && data.password!.length < 6) {
        ctx.addIssue({
          code: 'custom',
          message: 'Password must be at least 6 characters',
          path: ['password'],
        })
      }
    }

    if (hasPassword && data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      })
    }
  })

export type UserFormData = {
  id: string
  name: string
  email: string
  password: string
  password_confirmation: string
  role: UserRole
  is_active: boolean
}

export interface IUser {
  id: string
  email: string
  name: string
  role: UserRole
  location_id: string | null
  is_active: boolean
  email_verified_at: string | null
  last_login_at: string | null
  location: ILocation | null
  metadata: Array<Record<string, any>>
  created_at: string
  updated_at: string
}