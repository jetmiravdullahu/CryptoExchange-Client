import { z } from 'zod'
import type { FeeType } from './locationFee'

export const LocationSchema = z
  .object({
    id: z.union([z.uuid(), z.string().optional()]),
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    code: z.string().min(1, 'Code is required'),
    user_id: z.uuid().min(1, 'User is required'),
    fee_type: z
      .enum(['PCT', 'FLAT'], {
        message: 'Fee type is required',
      })
      .optional(),
    fee_value: z
      .string()
      .trim()
      .refine((v) => parseFloat(v) > 0, 'Amount is required')
      .refine((v) => /^\d+(\.\d+)?$/.test(v), 'Amount must be a valid number')
      .optional(),
  })
  .refine(
    (data) => {
      const isValidUuid = z.uuid().safeParse(data.id).success
      if (!isValidUuid) {
        return data.fee_type !== undefined && data.fee_value !== undefined
      }
      return true
    },
    {
      message:
        'Fee type and fee value are required when id is not a valid UUID',
      path: ['fee_type'],
    },
  )

export type LocationFormData = {
  id: string
  code: string
  name: string
  address: string
  city: string
  is_active: boolean
  user: {
    id: string
    name: string
  }
  fee_type?: FeeType
  fee_value?: string
}

export type LocationTableData = {
  id: string
  code: string
  name: string
  address: string
  city: string
  is_active: boolean
  user: {
    id: string
    name: string
  }
}

export type ILocation = {
  id: string
  code: string
  name: string
  address: string
  city: string
  country_code: string | null
  timezone: string
  is_active: boolean
  metadata: Array<Record<string, any>>
  created_at: string
  updated_at: string
}
