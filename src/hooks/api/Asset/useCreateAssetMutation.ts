import { useMutation } from '@tanstack/react-query'
import { createAsset } from '@/api/Asset/createAsset'

export function useCreateAssetMutation() {
  return useMutation({
    mutationFn: createAsset,
  })
}
