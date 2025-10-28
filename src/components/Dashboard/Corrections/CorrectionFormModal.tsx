import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import type { ValidationErrors } from '@/api/types'
import type { CorrectionFormData } from '@/types/correction'
import { CorrectionSchema } from '@/types/correction'
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
import { useGetAccountOptions } from '@/hooks/api/Account/useGetAccountOptionsQuery'
import { useCreateCorrectionMutation } from '@/hooks/api/Correction/useCreateCorrection'
import { getCorrectionsQuery } from '@/hooks/api/Correction/useGetCorrections'
import { getAccountsQuery } from '@/hooks/api/Account/useGetAccounts'

type CorrectionFormDialogProps = {
  open: boolean
  initialData: CorrectionFormData
  onOpenChange: (user: CorrectionFormData | null) => void
}

export function CorrectionFormDialog({
  open,
  onOpenChange,
  initialData,
}: CorrectionFormDialogProps) {
  const queryClient = useQueryClient()

  const { data: accountOptions } = useGetAccountOptions()
  const { mutate: createCorrection } = useCreateCorrectionMutation()

  const form = useAppForm({
    defaultValues: {
      account_id: initialData.account_id,
      amount: initialData.amount,
      correction_type: initialData.correction_type,
      reason: initialData.reason,
    },
    canSubmitWhenInvalid: false,
    validators: {
      onSubmit: (values) => {
        const result = CorrectionSchema.safeParse(values.value)
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
      createCorrection(value, {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: getCorrectionsQuery().queryKey,
          })
          queryClient.invalidateQueries({
            queryKey: getAccountsQuery.queryKey,
            exact: true,
            refetchType: 'none', // <-- avoids refetching immediately
          })
          onOpenChange(null)
        },
        onError(error) {
          if (!(error instanceof AxiosError)) return
          if (error.response?.status !== 422) return
          const errors = error.response.data
            .errors as ValidationErrors<CorrectionFormData>
          formApi.setErrorMap({
            onSubmit: {
              fields: {
                account_id: errors.account_id,
                amount: errors.amount,
                correction_type: errors.correction_type,
                reason: errors.reason,
              },
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
          <DialogTitle>Correction Modal</DialogTitle>
          <DialogDescription>
            Make adjustments to data through corrections
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
            <form.AppField name="account_id">
              {(field) => (
                <field.Select
                  label="Account"
                  placeholder="Select an account"
                  options={accountOptions}
                />
              )}
            </form.AppField>
            <form.AppField name="amount">
              {(field) => (
                <field.TextField
                  label="Amount"
                  placeholder="Amount"
                  type="number"
                />
              )}
            </form.AppField>
            <form.AppField name="correction_type">
              {(field) => (
                <field.Select
                  label="Correction Type"
                  options={[
                    {
                      label: 'Debit',
                      value: 'DEBIT',
                    },
                    {
                      label: 'Credit',
                      value: 'CREDIT',
                    },
                  ]}
                />
              )}
            </form.AppField>
            <form.AppField name="reason">
              {(field) => (
                <field.TextArea
                  label="Reason"
                  placeholder="Reason for the correction"
                  rows={4}
                />
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
              <form.SubscribeButton label="Correct Data" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
