import { Bell } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { useGetUnreadNotificationsCount } from '@/hooks/api/Notifications/useGetUnreadNotificationsCount'

export const NotificationBell = ({
  isCollapsed = false,
}: {
  isCollapsed?: boolean
}) => {
  const navigate = useNavigate()
  const { data } = useGetUnreadNotificationsCount()

  const handleBellClick = () => {
    navigate({
      to: '/dashboard/notifications',
    })
  }

  return (
    <Button
      onClick={handleBellClick}
      variant="ghost"
      size={isCollapsed ? 'icon' : 'default'}
      className={cn(
        'w-full gap-3 relative',
        isCollapsed ? 'justify-center px-2' : 'justify-start',
      )}
    >
      <Bell className="size-4" />
      {!isCollapsed && <span>Notifications</span>}
      {(data?.unread_count || 0) > 0 && (
        <Badge
          variant="destructive"
          className={cn(
            'ml-auto size-5 flex items-center justify-center p-0 text-xs ',
            isCollapsed ? 'absolute size-4 top-0 right-1' : 'relative',
          )}
        >
          {data?.unread_count}
        </Badge>
      )}
    </Button>
  )
}
