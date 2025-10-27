import dayjs from 'dayjs'
import { z } from 'zod'

export const ExchangeRateSchema = z
  .object({
    from_asset_id: z.uuid().min(1, 'From Asset is required'),
    to_asset_id: z.uuid().min(1, 'To Asset is required'),
    rate: z.coerce
      .number({
        error: 'Rate is required and must be a valid number',
      })
      .min(0, 'Rate must be positive'),
    effective_from: z.preprocess(
      (val) => (val === null ? undefined : val),
      z.iso.date('Must be a valid date'),
    ),
    effective_to: z.preprocess(
      (val) => (val === null ? undefined : val),
      z.iso.date('Must be a valid date').optional(),
    ),
    is_active: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.effective_to) {
        return dayjs(data.effective_to).isAfter(dayjs(data.effective_from))
      }
      return true
    },
    {
      message: 'Effective To must be after Effective From',
      path: ['effective_to'],
    },
  )

export type ExchangeRateFormData = {
  id: string
  from_asset_id: string | null
  to_asset_id: string | null
  rate: number
  effective_from: string | null
  effective_to: string | null
  is_active: boolean
}

export type ExchangeRatesTableData = {
  id: string
  from_asset_id: string | null
  to_asset_id: string | null
  rate: number
  effective_from: string
  effective_to: string | null
  is_active: boolean
  from_asset: {
    id: string
    code: string
    name: string
    asset_class: string
    precision: number
    min_amount: string
    max_amount: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }
  to_asset: {
    id: string
    code: string
    name: string
    asset_class: string
    precision: number
    min_amount: string
    max_amount: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }
}
