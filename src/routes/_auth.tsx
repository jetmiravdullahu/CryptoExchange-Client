import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { currentUserQuery } from '@/hooks/api/Auth/useGetCurrentUser'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    const cachedUser = context.queryClient.getQueryData(
      currentUserQuery.queryKey,
    )?.user

    if (!cachedUser)
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
  },
})

function RouteComponent() {
  return <Outlet />
}
