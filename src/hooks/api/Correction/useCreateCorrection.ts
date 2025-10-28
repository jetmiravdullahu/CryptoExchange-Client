import { useMutation } from '@tanstack/react-query'
import { createCorrection } from '@/api/Corrections/createAsset'

export function useCreateCorrectionMutation() {
  return useMutation({
    mutationFn: createCorrection,
  })
}
