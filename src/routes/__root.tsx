// import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

// import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import type { QueryClient } from '@tanstack/react-query'
import { currentUserQuery } from '@/hooks/api/Auth/useGetCurrentUser'
import { ThemeProvider } from '@/hooks/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import NotFound from '@/components/NotFound'
import { LoadingSpinner } from '@/components/LoadingComponent'
import { PostErrorComponent } from '@/components/PostErrorComponent'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const isLoading = useRouterState({
      select: (state) => state.isLoading,
    })

    return (
      <>
        <ThemeProvider>
          <HeadContent />
          {isLoading && <LoadingSpinner />}
          <Outlet />
          <Toaster position="top-center" />
        </ThemeProvider>
        {/* <TanStackDevtools
          config={{
            position: 'bottom-right',
            openHotkey: [],
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        /> */}
      </>
    )
  },
  notFoundComponent: NotFound,
  beforeLoad: async ({ context }) => {
    const token = localStorage.getItem('token')
    if (!token) return

    if (context.queryClient.getQueryData(currentUserQuery.queryKey)) return

    await context.queryClient.prefetchQuery(currentUserQuery)
  },
  pendingComponent: LoadingSpinner,
  errorComponent: PostErrorComponent,
})
