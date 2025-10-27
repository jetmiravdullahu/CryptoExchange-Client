import { useMutation } from '@tanstack/react-query'
import { deleteAsset } from '@/api/Asset/deleteAsset'

export function useDeleteAssetMutation() {
  return useMutation({
    mutationFn: deleteAsset,
  })
}
