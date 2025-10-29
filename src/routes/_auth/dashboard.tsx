import { Suspense, useState } from 'react'
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Sun,
} from 'lucide-react'

import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarNav } from '@/components/SidebarNav'
import { currentUserQuery } from '@/hooks/api/Auth/useGetCurrentUser'
import { NotificationBell } from '@/components/NotificationCount'

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const cachedUser = context.queryClient.getQueryData(
      currentUserQuery.queryKey,
    )?.user
    if (!cachedUser)
      throw redirect({
        to: '/login',
      })

    if (cachedUser.role === 'SELLER')
      throw redirect({
        to: '/',
      })
  },
})

function RouteComponent() {
  const { theme, toggleTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    localStorage.removeItem('token')
    queryClient.clear()
    navigate({
      to: '/login',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col border-r bg-card transition-all duration-300',
          isCollapsed ? 'lg:w-16' : 'lg:w-64',
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && (
            <Link
              to="/dashboard"
              className="text-lg font-bold text-foreground cursor-pointer"
            >
              Dashboard
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn('shrink-0', isCollapsed && 'mx-auto')}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <Suspense fallback={<div>Loading...</div>}>
            <SidebarNav
              mobile={false}
              setMobileOpen={setMobileOpen}
              isCollapsed={isCollapsed}
            />
          </Suspense>
        </div>

        <div className="border-t p-2">
          <NotificationBell isCollapsed={isCollapsed} />
          <Button
            variant="ghost"
            size={isCollapsed ? 'icon' : 'default'}
            onClick={toggleTheme}
            className={cn(
              'w-full gap-3',
              isCollapsed ? 'justify-center px-2' : 'justify-start',
            )}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 shrink-0" />
            ) : (
              <Sun className="h-5 w-5 shrink-0" />
            )}
            {!isCollapsed && <span>Toggle Theme</span>}
          </Button>
          <Button
            variant="ghost"
            size={isCollapsed ? 'icon' : 'default'}
            onClick={handleLogout}
            className={cn(
              'w-full gap-3',
              isCollapsed ? 'justify-center px-2' : 'justify-start',
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-4">
                <Link
                  to="/dashboard"
                  className="text-lg font-bold text-foreground cursor-pointer"
                >
                  Dashboard
                </Link>
              </div>
              <div className="py-4">
                <SidebarNav
                  mobile
                  setMobileOpen={setMobileOpen}
                  isCollapsed={isCollapsed}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 border-t p-2">
                <NotificationBell />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                  <span>Toggle Theme</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          'pt-16 lg:pt-0', // Mobile top padding for fixed header
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64',
        )}
      >
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
