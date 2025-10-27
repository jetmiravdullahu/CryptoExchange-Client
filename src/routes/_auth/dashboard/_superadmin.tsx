import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { currentUserQuery } from '@/hooks/api/Auth/useGetCurrentUser'
import { LoadingSpinner } from '@/components/LoadingComponent'

export const Route = createFileRoute('/_auth/dashboard/_superadmin')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    const cachedUser = context.queryClient.getQueryData(
      currentUserQuery.queryKey,
    )

    if (!cachedUser)
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })

    if (cachedUser.user.role !== 'SUPER_ADMIN')
      throw redirect({
        to: '/dashboard',
      })
  },
  pendingComponent: LoadingSpinner,
})

function RouteComponent() {
  return <Outlet />
}
