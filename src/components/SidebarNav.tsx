import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  ArrowLeftRight,
  Eraser,
  MapPin,
  Package,
  Receipt,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { currentUserQuery } from '@/hooks/api/Auth/useGetCurrentUser'

const navigation = [
  {
    name: 'Assets',
    href: '/dashboard/assets',
    icon: Package,
    role: ['SUPER_ADMIN'],
  },
  {
    name: 'Accounts',
    href: '/dashboard/accounts',
    icon: Wallet,
  },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Locations', href: '/dashboard/locations', icon: MapPin },

  {
    name: 'Transactions',
    href: '/dashboard/transactions',
    icon: Receipt,
  },

  {
    name: 'Transfers',
    href: '/dashboard/transfers',
    icon: ArrowLeftRight,
  },
  {
    name: 'Corrections',
    href: '/dashboard/corrections',
    icon: Eraser,
  },
]

export const SidebarNav = ({
  mobile = false,
  setMobileOpen,
  isCollapsed,
}: {
  mobile?: boolean
  setMobileOpen: (open: boolean) => void
  isCollapsed: boolean
}) => {
  const { location } = useRouterState()

  const { data } = useSuspenseQuery(currentUserQuery)

  return (
    <nav className="flex flex-col gap-1 p-2">
      {navigation.map((item) => {
        if (item.role && !item.role.includes(data.user.role)) {
          return null
        }

        const Icon = item.icon
        const isActive = location.pathname === item.href

        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => mobile && setMobileOpen(false)}
            preloadDelay={300}
          >
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3',
                isActive &&
                'bg-primary/70 text-sidebar-foreground! hover:text-sidebar-primary! dark:text-sidebar-accent',
                !mobile && isCollapsed && 'justify-center px-2',
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {(mobile || !isCollapsed) && <span>{item.name}</span>}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
