import { useMutation } from '@tanstack/react-query'
import { editAsset } from '@/api/Asset/editAsset'

export function useEditAssetMutation() {
  return useMutation({
    mutationFn: editAsset,
  })
}
