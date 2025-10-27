import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useStore } from '@tanstack/react-form'
import type { TransferFormData } from '@/types/transfer'
import type { ValidationErrors } from '@/api/types'
import { TransferFromSchema } from '@/types/transfer'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppForm } from '@/hooks/form'
import { useGetCurrentUser } from '@/hooks/api/Auth/useGetCurrentUser'
import { useGetAssetOptions } from '@/hooks/api/Asset/useGetAssetOptionsQuery'
import { useGetLocationOptions } from '@/hooks/api/Location/useGetLocationOptionsQuery'
import { useCreateTransferMutation } from '@/hooks/api/Transfer/useCreateTransfer'
import { getTransfersQuery } from '@/hooks/api/Transfer/useGetTransfers'

export const TransferFormModal = ({
  isOpen,
  onClose,
  transfer,
}: {
  isOpen: boolean
  onClose: () => void
  transfer: TransferFormData
}) => {
  const queryClient = useQueryClient()

  const { data: currentUser } = useGetCurrentUser()
  const { data: assetOptions } = useGetAssetOptions()
  const { data: locationOptions } = useGetLocationOptions()

  console.log({currentUser})

  const { mutate: createTransfer } = useCreateTransferMutation()

  const form = useAppForm({
    defaultValues: {
      transfer_type: transfer.transfer_type,
      amount: transfer.amount,
      to_location_id: transfer.to_location_id,
      from_location_id: transfer.from_location_id,
      asset_id: transfer.asset_id,
      notes: transfer.notes,
    },
    canSubmitWhenInvalid: false,
    validators: {
      onSubmit: (values) => {
        const result = TransferFromSchema(
          currentUser.user.role === 'SUPER_ADMIN',
        ).safeParse(values.value)
        if (result.success) return null
        const flattened = result.error.flatten().fieldErrors
        const errors: Record<string, string | undefined> = {}
        for (const key of Object.keys(flattened)) {
          const val = flattened[key as keyof typeof flattened]
          errors[key] = Array.isArray(val) ? val.join(', ') : (val as any)
        }
        console.log('Validation errors:', { errors })
        return {
          form: 'Invalid data',
          fields: errors,
        }
      },
    },
    onSubmit: ({ value, formApi }) => {
      createTransfer(value, {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: getTransfersQuery().queryKey,
          })
          onClose()
        },
        onError(error) {
          if (!(error instanceof AxiosError)) return
          if (error.response?.status !== 422) return
          const errors = error.response.data
            .errors as ValidationErrors<TransferFormData>
          formApi.setErrorMap({
            onSubmit: {
              fields: errors,
            },
          })
        },
      })
    },
  })

  const formState = useStore(form.store)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer assets</DialogTitle>
          <DialogDescription>
            Transfer assets between locations.
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
            <form.AppField name="transfer_type">
              {(field) => (
                <field.Select
                  label="Type"
                  placeholder="Select Amount"
                  disabled={currentUser.user.role !== 'SUPER_ADMIN'}
                  options={[
                    {
                      label: 'Base To Location',
                      value: 'BASE_TO_LOCATION',
                    },
                    {
                      label: 'Location To Location',
                      value: 'LOCATION_TO_LOCATION',
                    },
                  ]}
                />
              )}
            </form.AppField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formState.values.transfer_type === 'LOCATION_TO_LOCATION' && (
                <form.AppField name="from_location_id">
                  {(field) => (
                    <field.Select
                      label="From Location"
                      placeholder="Location"
                      disabled={transfer.from_location_id !== ''}
                      options={locationOptions}
                    />
                  )}
                </form.AppField>
              )}
              <div
                className={
                  formState.values.transfer_type === 'BASE_TO_LOCATION'
                    ? 'md:col-span-2'
                    : ''
                }
              >
                <form.AppField name="to_location_id">
                  {(field) => (
                    <field.Select
                      label="To Location"
                      placeholder="Location"
                      options={locationOptions.filter((option) =>
                        formState.values.from_location_id
                          ? option.value !== formState.values.from_location_id
                          : true,
                      )}
                    />
                  )}
                </form.AppField>
              </div>
            </div>
            <form.AppField name="asset_id">
              {(field) => (
                <field.Select
                  label="Asset"
                  placeholder="Asset"
                  options={assetOptions}
                />
              )}
            </form.AppField>
            <form.AppField name="amount">
              {(field) => (
                <field.TextField
                  label="Amount"
                  placeholder="Select Amount"
                  type="number"
                />
              )}
            </form.AppField>
            <form.AppField name="notes">
              {(field) => (
                <field.TextArea
                  label="Notes"
                  placeholder="Enter notes"
                  rows={3}
                />
              )}
            </form.AppField>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              className="h-9"
            >
              Cancel
            </Button>
            <form.AppForm>
              <form.SubscribeButton label={'Transfer'} />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
