import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { Percent } from 'lucide-react'
import { useStore } from '@tanstack/react-form'
import type { ValidationErrors } from '@/api/types'
import type { LocationFeeFormData } from '@/types/locationFee'
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
import { LocationFeeSchema } from '@/types/locationFee'
import { useCreateLocationFeeMutation } from '@/hooks/api/LocationFee/useCreateLocationFee'
import { getLocationFeesQuery } from '@/hooks/api/LocationFee/useGetLocationFees'

type LocationFeeFormDialogProps = {
  open: boolean
  initialData: LocationFeeFormData
  onOpenChange: (user: LocationFeeFormData | null) => void
  locationId: string
}

export function LocationFeeFormDialog({
  open,
  onOpenChange,
  initialData,
  locationId,
}: LocationFeeFormDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: createLocationFee } = useCreateLocationFeeMutation()

  const form = useAppForm({
    defaultValues: {
      id: initialData.id,
      fee_type: initialData.fee_type,
      fee_value: initialData.fee_value,
      min_fee: initialData.min_fee,
      max_fee: initialData.max_fee,
      is_active: initialData.is_active,
    },
    canSubmitWhenInvalid: false,
    validators: {
      onSubmit: (values) => {
        const result = LocationFeeSchema.safeParse(values.value)
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
      await createLocationFee(
        { ...value, location_id: locationId },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: getLocationFeesQuery(locationId).queryKey,
            })
            onOpenChange(null)
          },
          onError(error) {
            if (!(error instanceof AxiosError)) return
            if (error.response?.status !== 422) return
            const errors = error.response.data
              .errors as ValidationErrors<LocationFeeFormData>
            formApi.setErrorMap({
              onSubmit: {
                fields: errors,
              },
            })
          },
        },
      )
    },
  })
  const formStore = useStore(form.store).values

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(null)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Location Fee</DialogTitle>
          <DialogDescription>
            Add a new location fee to the system
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
              <form.AppField name="fee_type">
                {(field) => (
                  <field.Select
                    label="Fee Type"
                    options={[
                      { label: 'Percentage', value: 'PCT' },
                      { label: 'Flat', value: 'FLAT' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="fee_value">
                {(field) => (
                  <div className="relative">
                    <field.TextField
                      type="number"
                      label="Fee Value"
                      placeholder="Fee Value"
                    />
                    {formStore.fee_type === 'PCT' && (
                      <span>
                        <Percent className="absolute w-4 h-4 right-3 top-[43px] text-muted-foreground" />
                      </span>
                    )}
                  </div>
                )}
              </form.AppField>
            </div>

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
              <form.SubscribeButton label="Create Location Fee" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
