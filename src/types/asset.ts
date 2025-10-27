import { z } from 'zod'

export const AssetSchema = z.object({
  id: z.union([z.uuid(), z.string().optional()]),
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  is_active: z.boolean().optional(),
  asset_class: z.enum(['CRYPTO', 'FIAT'], {
    message: 'Asset class is required',
  }),
})

export type AssetClass = 'CRYPTO' | 'FIAT'

export type AssetFormData = {
  id: string
  code: string
  name: string
  asset_class: AssetClass
  is_active: boolean
}

export type AssetTableData = {
  id: string
  code: string
  name: string
  asset_class: AssetClass
  is_active: boolean
}

export interface IAsset {
  id: string
  code: string
  name: string
  asset_class: AssetClass
  precision: number
  min_amount: string
  max_amount: string | null
  is_active: boolean
  metadata: Array<Record<string, any>>
  created_at: string
  updated_at: string
}