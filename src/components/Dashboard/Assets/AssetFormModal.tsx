import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import type { AssetFormData } from '@/types/asset'
import type { ValidationErrors } from '@/api/types'
import { AssetSchema } from '@/types/asset'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateAssetMutation } from '@/hooks/api/Asset/useCreateAssetMutation'
import { useEditAssetMutation } from '@/hooks/api/Asset/useEditAssetMutation'
import { useAppForm } from '@/hooks/form'
import { Button } from '@/components/ui/button'

type Props = {
  open: boolean
  initialData: AssetFormData
  onOpenChange: (val: AssetFormData | null) => void
  isEdit: boolean
}

export function AssetFormDialog({
  open,
  onOpenChange,
  initialData,
  isEdit,
}: Props) {
  const { mutateAsync: createAsset } = useCreateAssetMutation()
  const { mutateAsync: editAsset } = useEditAssetMutation()
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      id: initialData.id,
      name: initialData.name,
      is_active: initialData.is_active,
      code: initialData.code,
      asset_class: initialData.asset_class,
    },
    canSubmitWhenInvalid: false,
    validators: {
      onSubmit: (values) => {
        const result = AssetSchema.safeParse(values.value)
        if (result.success) return null
        const flattened = result.error.flatten().fieldErrors
        const errors: Record<string, string | undefined> = {}
        for (const key of Object.keys(flattened)) {
          const val = flattened[key as keyof typeof flattened]
          errors[key] = Array.isArray(val) ? val.join(', ') : (val as any)
        }

        return {
          form: 'Invalid data',
          fields: errors,
        }
      },
    },
    onSubmit: async ({ value, formApi }) => {
      const mutateFn = value.id ? editAsset : createAsset
      await mutateFn(value, {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['getAssets'] })
          onOpenChange(null)
        },
        onError(error) {
          if (!(error instanceof AxiosError)) return
          if (error.response?.status !== 422) return
          const errors = error.response.data
            .errors as ValidationErrors<AssetFormData>
          formApi.setErrorMap({
            onSubmit: {
              fields: errors,
            },
          })
        },
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(null)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Asset' : 'Create New Asset'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update location information'
              : 'Add a new location to the system'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <form.AppField name="name">
                {(field) => <field.TextField label="Name" placeholder="Name" />}
              </form.AppField>

              <form.AppField name="code">
                {(field) => <field.TextField label="Code" placeholder="Code" />}
              </form.AppField>
            </div>
            <form.AppField name="asset_class">
              {(field) => (
                <field.Select
                  label="Asset Class"
                  placeholder="Asset Class"
                  options={[
                    { label: 'Crypto', value: 'CRYPTO' },
                    { label: 'Fiat', value: 'FIAT' },
                  ]}
                />
              )}
            </form.AppField>
            <form.AppField name="is_active">
              {(field) => (
                <div className="mt-8">
                  <field.Switch label="Is Active" />
                </div>
              )}
            </form.AppField>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(null)}
              className="h-9"
            >
              Cancel
            </Button>
            <form.AppForm>
              <form.SubscribeButton
                label={!isEdit ? 'Create Asset' : 'Save Changes'}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
