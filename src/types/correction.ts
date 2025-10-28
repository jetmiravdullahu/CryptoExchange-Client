import z from "zod"

export type CorrectionType = 'DEBIT' | 'CREDIT'

export const CorrectionSchema = z.object({
  account_id: z.string().min(1, 'Account is required'),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  correction_type: z.enum(['DEBIT', 'CREDIT']),
  reason: z.string().min(10, 'Reason must be at least 10 characters long'),
})

export interface Correction {
  id: string
  correction_ref: string
  account_id: string
  amount: string
  correction_type: CorrectionType
  reason: string
  related_entity_type: string
  related_entity_id: string
  metadata: Array<any>
  approved_by: string | null
  approved_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface CorrectionFormData {
  account_id: string
  amount: string
  correction_type: CorrectionType
  reason: string
}