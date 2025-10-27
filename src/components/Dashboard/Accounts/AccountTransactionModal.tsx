import { AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import type { ValidationErrors } from '@/api/types'
import type { AccountTransactionInput } from '@/types/account'
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
import { AccountSchema } from '@/types/account'
import { useDepositAmountMutation } from '@/hooks/api/Account/useDepositAmount'
import { useWithdrawAmountMutation } from '@/hooks/api/Account/useWithdrawAmount'
import { getAccountsQuery } from '@/hooks/api/Account/useGetAccounts'

export const AccountTransactionModal = ({
  isOpen,
  onClose,
  transaction,
}: {
  isOpen: boolean
  onClose: () => void
  transaction: AccountTransactionInput
}) => {
  const queryClient = useQueryClient()

  const { mutate: depositAmount } = useDepositAmountMutation()
  const { mutate: withdrawAmount } = useWithdrawAmountMutation()

  const form = useAppForm({
    defaultValues: {
      amount: transaction.amount,
      description: transaction.description,
    },
    canSubmitWhenInvalid: false,
    validators: {
      onSubmit: (values) => {
        const result = AccountSchema(
          transaction.type === 'withdraw'
            ? transaction.current_balance
            : undefined,
        ).safeParse(values.value)
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
      const mutateFn =
        transaction.type === 'withdraw' ? withdrawAmount : depositAmount

      mutateFn(
        {
          ...value,
          account_id: transaction.account_id,
        },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: getAccountsQuery.queryKey,
            })
            onClose()
          },
          onError(error) {
            if (!(error instanceof AxiosError)) return
            if (error.response?.status !== 422) return
            const errors = error.response.data
              .errors as ValidationErrors<AccountTransactionInput>
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {transaction.type === 'deposit' ? 'Deposit to' : 'Withdraw from'}{' '}
            Account
          </DialogTitle>
          <DialogDescription>
            {transaction.type === 'deposit'
              ? 'Deposit funds into your account.'
              : 'Withdraw funds from your account.'}
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
            <form.AppField name="amount">
              {(field) => (
                <field.TextField
                  label="Amount"
                  placeholder="Select Amount"
                  type="number"
                />
              )}
            </form.AppField>
            <form.AppField name="description">
              {(field) => (
                <field.TextArea
                  label="Description"
                  placeholder="Enter description"
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
              <form.SubscribeButton
                label={transaction.type === 'deposit' ? 'Deposit' : 'Withdraw'}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
