import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { LoginForm } from '@/components/LoginForm'
import { currentUserQuery } from '@/hooks/api/Auth/useGetCurrentUser'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  component: SimpleForm,
  beforeLoad: ({ context, search }) => {
    const cachedUser = context.queryClient.getQueryData(
      currentUserQuery.queryKey,
    )?.user
    if (!cachedUser) return

    throw redirect({
      to:
        search.redirect || (cachedUser.role === 'SELLER' ? '/' : '/dashboard'),
    })
  },
})

function SimpleForm() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
