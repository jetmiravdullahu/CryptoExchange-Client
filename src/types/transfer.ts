import z from 'zod'
import type { Account } from './account'
import type { IAsset } from './asset'
import type { ILocation } from './location'
import type { IUser } from './user'

export type TransferStatus =
  | 'INITIATED'
  | 'IN_TRANSIT'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'RETURNED'

export type TransferStatusActions = 'confirm' | 'reject' | 'return' | 'cancel' | 'start_transit'


export const TransferFromSchema = (isSuperAdmin?: boolean) =>
  z
    .object({
      asset_id: z.uuid().min(1, 'Asset is required'),
      from_location_id: z.preprocess(
        (val) => (val === '' ? null : val),
        z.uuid().min(1, 'From location is required').nullable(),
      ),
      to_location_id: z.uuid().min(1, 'To location is required'),
      transfer_type: isSuperAdmin
        ? z.enum(['BASE_TO_LOCATION', 'LOCATION_TO_LOCATION'], {
            message: 'Transfer type is required',
          })
        : z.literal('LOCATION_TO_LOCATION', {
            message: 'Only location to location transfers are allowed',
          }),
      amount: z
        .string()
        .trim()
        .refine((v) => parseFloat(v) > 0, 'Amount is required')
        .refine(
          (v) => /^\d+(\.\d+)?$/.test(v),
          'Amount must be a valid number',
        ),
      notes: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.transfer_type === 'LOCATION_TO_LOCATION' &&
        !data.from_location_id
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'From location is required for location to location transfers',
          path: ['from_location_id'],
        })
      }
    })

export type TransferType = 'BASE_TO_LOCATION' | 'LOCATION_TO_LOCATION'

export type ITransfer = {
  id: string
  transfer_ref: string
  transfer_type: TransferType
  from_account_id: string
  to_account_id: string
  asset_id: string
  amount: string
  status: TransferStatus
  in_transit_at: string | null
  confirmed_at: string | null
  rejected_at: string | null
  returned_at: string | null
  cancelled_at: string | null
  rejection_reason: string | null
  notes: string | null
  metadata: Record<string, any> | null
  initiated_by: IUser
  confirmed_by: IUser | null
  rejected_by: IUser | null
  returned_by: IUser | null
  cancelled_by: IUser | null
  created_at: string
  updated_at: string

  from_location_id: string | null
  to_location_id: string
  transit_account_id: string | null
  from_account: Account
  to_account: Account
  from_location: ILocation | null
  to_location: ILocation
  asset: IAsset
}

export type TransferFormData = {
  transfer_type: TransferType
  to_location_id: string
  from_location_id?: string
  asset_id: string
  amount: string
  notes?: string
}
