import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import type { UserFormData } from '@/types/user'
import type { ValidationErrors } from '@/api/types'
import { UserSchema } from '@/types/user'
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
import { useCreateUserMutation } from '@/hooks/api/User/useCreateUser'
import { useEditUserMutation } from '@/hooks/api/User/useEditUser'
import { getUsersQuery } from '@/hooks/api/User/useGetUsers'
import { getSellersQuery } from '@/hooks/api/User/useGetSellers'

type UserFormDialogProps = {
  open: boolean
  initialData: UserFormData
  onOpenChange: (user: UserFormData | null) => void
  isEdit: boolean
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialData,
  isEdit,
}: UserFormDialogProps) {
  const { mutateAsync: createUser } = useCreateUserMutation()
  const { mutateAsync: editUser } = useEditUserMutation()

  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      id: initialData.id,
      email: initialData.email,
      name: initialData.name,
      password: '',
      password_confirmation: '',
      role: initialData.role,
      is_active: initialData.is_active,
    },
    canSubmitWhenInvalid: false,
    validators: {
      onSubmit: (values) => {
        const result = UserSchema.safeParse(values.value)
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
      const mutateFn = value.id ? editUser : createUser

      await mutateFn(value, {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: getUsersQuery().queryKey })
          queryClient.invalidateQueries({ queryKey: getSellersQuery.queryKey })
          onOpenChange(null)
        },
        onError(error) {
          if (!(error instanceof AxiosError)) return
          if (error.response?.status !== 422) return
          const errors = error.response.data
            .errors as ValidationErrors<UserFormData>

          formApi.setErrorMap({
            onSubmit: {
              fields: {
                name: errors.name,
                email: errors.email,
                password: errors.password,
                password_confirmation: errors.password_confirmation,
                role: errors.role,
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
          <DialogTitle>{isEdit ? 'Edit User' : 'Create New User'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update user information. Fields will adjust based on the selected role.'
              : 'Add a new user to the system. Fields will adjust based on the selected role.'}
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

              <form.AppField name="email">
                {(field) => (
                  <field.TextField
                    autoComplete="email"
                    label="Email"
                    placeholder="Email"
                  />
                )}
              </form.AppField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <form.AppField name="password">
                {(field) => (
                  <field.PasswordField
                    label="Password"
                    placeholder="Password"
                  />
                )}
              </form.AppField>

              <form.AppField name="password_confirmation">
                {(field) => (
                  <field.PasswordField
                    label="Confirm Password"
                    placeholder="Confirm Password"
                  />
                )}
              </form.AppField>
            </div>

            <form.AppField name="role">
              {(field) => (
                <field.Select
                  label="Role"
                  disabled={isEdit}
                  options={[
                    { label: 'Seller', value: 'SELLER' },
                    { label: 'Admin', value: 'ADMIN' },
                    { label: 'Super Admin', value: 'SUPER_ADMIN' },
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
                label={!isEdit ? 'Create User' : 'Save Changes'}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
