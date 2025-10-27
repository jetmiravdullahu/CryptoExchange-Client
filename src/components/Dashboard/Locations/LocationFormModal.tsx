import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { Percent } from 'lucide-react'
import { useStore } from '@tanstack/react-form'
import type { ValidationErrors } from '@/api/types'
import type { LocationFormData } from '@/types/location'
import { LocationSchema } from '@/types/location'
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
import { getSellersQuery, useGetSellers } from '@/hooks/api/User/useGetSellers'
import { useCreateLocationMutation } from '@/hooks/api/Location/useCreateLocation'
import { useEditLocationMutation } from '@/hooks/api/Location/useEditLocation'
import { getLocationsQuery } from '@/hooks/api/Location/useGetLocations'

type LocationFormDialogProps = {
  open: boolean
  initialData: LocationFormData
  onOpenChange: (user: LocationFormData | null) => void
  isEdit: boolean
}

export function LocationFormDialog({
  open,
  onOpenChange,
  initialData,
  isEdit,
}: LocationFormDialogProps) {
  const { mutate: createLocation } = useCreateLocationMutation()
  const { mutate: editLocation } = useEditLocationMutation()

  const queryClient = useQueryClient()

  const { data: sellers } = useGetSellers()

  const form = useAppForm({
    defaultValues: {
      id: initialData.id,
      name: initialData.name,
      is_active: initialData.is_active,
      code: initialData.code,
      address: initialData.address,
      city: initialData.city,
      user_id: initialData.user.id,
      fee_type: initialData.fee_type,
      fee_value: initialData.fee_value,
    },
    canSubmitWhenInvalid: false,
    validators: {
      onSubmit: (values) => {
        const result = LocationSchema.safeParse(values.value)
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
    onSubmit: ({ value, formApi }) => {
      const mutationFn = value.id ? editLocation : createLocation

      mutationFn(value, {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: getLocationsQuery().queryKey,
          })
          queryClient.invalidateQueries({ queryKey: getSellersQuery.queryKey })
          onOpenChange(null)
        },
        onError(error) {
          if (error instanceof AxiosError && error.response?.status === 422) {
            const errors = error.response.data
              .errors as ValidationErrors<LocationFormData>

            formApi.setErrorMap({
              onSubmit: { fields: errors },
            })
          }
        },
      })
    },
  })

  const formStore = useStore(form.store).values

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(null)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Location' : 'Create New Location'}
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
            <div className="space-y-1.5">
              <form.AppField name="address">
                {(field) => (
                  <field.TextField label="Address" placeholder="Address" />
                )}
              </form.AppField>
            </div>

            <div className="space-y-1.5">
              <form.AppField name="city">
                {(field) => <field.TextField label="City" placeholder="City" />}
              </form.AppField>
            </div>

            <form.AppField name="is_active">
              {(field) => (
                <div className="mt-8">
                  <field.Switch label="Is Active" />
                </div>
              )}
            </form.AppField>
            <form.AppField name="user_id">
              {(field) => (
                <field.Select
                  label="User"
                  placeholder="User"
                  disabled={sellers.length === 0}
                  options={
                    initialData.user.id &&
                    !sellers.find((s) => s.value === initialData.user.id)
                      ? [
                          ...sellers,
                          {
                            label: initialData.user.name,
                            value: initialData.user.id,
                          },
                        ]
                      : sellers
                  }
                />
              )}
            </form.AppField>
            {!isEdit && (
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
            )}
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
                label={!isEdit ? 'Create Location' : 'Save Changes'}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
