import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import type { ValidationErrors } from '@/api/types'
import type { TransactionFormData } from '@/types/transaction'
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
import { useCreateTransactionMutation } from '@/hooks/api/Transaction/useCreateTransaction'

type TransactionFormDialogProps = {
  open: boolean
  initialData: TransactionFormData
  onOpenChange: (user: TransactionFormData | null) => void
  isEdit: boolean
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  initialData,
  isEdit,
}: TransactionFormDialogProps) {
  const { mutate: createTransaction } = useCreateTransactionMutation()
  // const { mutate: editTransaction } = useEditTransactionMutation()

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
    },
    canSubmitWhenInvalid: false,
    validators: {
      onSubmit: (values) => {
        const result = TransactionSchema.safeParse(values.value)
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
      createTransaction(value, {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['getTransactions'] })
          queryClient.invalidateQueries({ queryKey: getSellersQuery.queryKey })
          onOpenChange(null)
        },
        onError(error) {
          if (error instanceof AxiosError && error.response?.status === 422) {
            const errors = error.response.data
              .errors as ValidationErrors<TransactionFormData>

            formApi.setErrorMap({
              onSubmit: { fields: errors },
            })
          }
        },
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(null)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Transaction' : 'Create New Transaction'}
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
                    initialData.user.id && !sellers.find((s) => s.value === initialData.user.id)
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
          </div>
          <DialogFooter className="mt-4">
            ``
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
                label={!isEdit ? 'Create Transaction' : 'Save Changes'}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
