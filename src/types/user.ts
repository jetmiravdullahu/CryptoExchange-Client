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
  metadata: {
    phone: string | null
    profile: {
      bio: string | null
      avatar_url: string | null
      date_of_birth: string | null
    }
    version: string
    security: {
      '2fa_enabled': boolean
      locked_until: string | null
      last_password_change: string
      failed_login_attempts: number
    }
    created_by: string
    preferences: {
      language: string
      timezone: string
      date_format: string
      time_format: string
      notifications: {
        sms: boolean
        push: boolean
        email: boolean
      }
      currency_display: string
    }
    seller_info?: {
      hire_date: string
      employee_id: string
      location_city: string
      location_code: string
      shift_preference: string
    }
    phone_verified: boolean
  }
  created_at: string
  updated_at: string
}
