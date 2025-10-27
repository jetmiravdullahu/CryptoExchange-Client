import { z } from 'zod'

export const LocationFeeSchema = z
  .object({
    id: z.union([z.uuid(), z.string().optional()]),
    fee_type: z.enum(['PCT', 'FLAT'], 'Fee Type is required'),
    fee_value: z.coerce
      .number({
        error: 'Fee Value is required and must be a valid number',
      })
      .min(0, 'Fee Value must be positive'),
    min_fee: z.number().min(0, 'Min Fee must be positive').optional(),
    max_fee: z.number().min(0, 'Max Fee must be positive').optional(),
    is_active: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fee_type === 'PCT' && data.fee_value > 100) {
      ctx.addIssue({
        path: ['fee_value'],
        code: 'custom',
        message: 'Percentage cannot exceed 100',
      })
    }
  })

export type FeeType = 'PCT' | 'FLAT'

export type LocationFeeFormData = {
  id: string
  fee_type: FeeType
  fee_value: number
  min_fee?: number
  max_fee?: number
  is_active: boolean
}

export type LocationFeesTableData = {
  id: string
  fee_type: FeeType
  fee_value: number
  min_fee?: number
  max_fee?: number
  is_active: boolean
}
