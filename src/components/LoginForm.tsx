import { GalleryVerticalEnd } from 'lucide-react'
import z from 'zod'
import { useNavigate } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { useLoginMutation } from '@/hooks/api/Auth/useLogin'

const schema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const { mutateAsync } = useLoginMutation()

  const form = useAppForm({
    defaultValues: {
      email: 'john@example.com',
      password: 'Jet1234A!',
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { data: res } = await mutateAsync(value, {
          onSuccess: (data) => {
            if (data.data.token) {
              localStorage.setItem('token', data.data.token)
            }
          },
        })

        navigate({ to: res.user.role === 'SELLER' ? '/' : '/dashboard' })
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to TRESOREX</h1>
          </div>
          <form.AppField name="email">
            {(field) => <field.TextField label="Email" />}
          </form.AppField>
          <form.AppField name="password">
            {(field) => <field.PasswordField label="Password" />}
          </form.AppField>
          <form.AppForm>
            <form.SubscribeButton label="Login" />
          </form.AppForm>
        </FieldGroup>
      </form>
    </div>
  )
}
