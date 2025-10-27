import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import dayjs from 'dayjs'
import { useStore } from '@tanstack/react-form'
import type { ValidationErrors } from '@/api/types'
import type { ExchangeRateFormData } from '@/types/exchangeRate'
import type { Matcher } from 'react-day-picker'
import { ExchangeRateSchema } from '@/types/exchangeRate'
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
import { useCreateExchangeRateMutation } from '@/hooks/api/ExchangeRate/useCreateExchangeRate'
import { useGetAssetOptions } from '@/hooks/api/Asset/useGetAssetOptionsQuery'
import { getExchangeRatesQuery } from '@/hooks/api/ExchangeRate/useGetExchangeRates'

type ExchangeRateDialogProps = {
  open: boolean
  initialData: ExchangeRateFormData
  onOpenChange: (user: ExchangeRateFormData | null) => void
  assetId: string
}

export function ExchangeRateFormDialog({
  open,
  onOpenChange,
  initialData,
  assetId,
}: ExchangeRateDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: createExchangeRate } = useCreateExchangeRateMutation()

  const { data: assetOptions } = useGetAssetOptions()

  const form = useAppForm({
    defaultValues: {
      from_asset_id: assetId,
      to_asset_id: initialData.to_asset_id,
      rate: initialData.rate,
      effective_from: initialData.effective_from,
      effective_to: initialData.effective_to,
      is_active: initialData.is_active,
    },
    canSubmitWhenInvalid: false,
    validators: {
      onSubmit: (values) => {
        const result = ExchangeRateSchema.safeParse(values.value)
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
      const data = ExchangeRateSchema.parse(value)

      await createExchangeRate(data, {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: getExchangeRatesQuery(assetId).queryKey,
          })
          onOpenChange(null)
        },
        onError(error) {
          if (error instanceof AxiosError && error.response?.status === 422) {
            const errors = error.response.data
              .errors as ValidationErrors<ExchangeRateFormData>

            formApi.setErrorMap({
              onSubmit: { fields: errors },
            })
          }
        },
      })
    },
  })
  const fromAsset = assetOptions.find((asset) => asset.value === assetId)

  console.log({ assetOptions, fromAsset })

  const effectiveFrom = useStore(form.store).values.effective_from

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(null)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exchange Rate</DialogTitle>
          <DialogDescription>
            Add a new exchange rate to the system
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
              <form.AppField name="from_asset_id">
                {(field) => (
                  <field.Select
                    label="From Asset"
                    disabled
                    options={assetOptions}
                  />
                )}
              </form.AppField>

              <form.AppField name="to_asset_id">
                {(field) => (
                  <field.Select
                    label="To Asset"
                    placeholder="To Asset"
                    options={assetOptions.filter((option) => {
                      return option.class !== fromAsset?.class
                    })}
                  />
                )}
              </form.AppField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <form.AppField name="effective_from">
                {(field) => (
                  <field.CalendarField
                    placeholder="Effective From"
                    label="Effective From"
                  />
                )}
              </form.AppField>

              <form.AppField name="effective_to">
                {(field) => (
                  <field.CalendarField
                    placeholder="Effective To"
                    label="Effective To"
                    disabled={
                      effectiveFrom
                        ? ({
                            before: dayjs(effectiveFrom).add(1, 'day').toDate(),
                          } as Matcher)
                        : undefined
                    }
                  />
                )}
              </form.AppField>
            </div>

            <form.AppField name="rate">
              {(field) => (
                <field.TextField
                  label="Rate"
                  placeholder="Rate"
                  type="number"
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
              <form.SubscribeButton label="Save Changes" />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
