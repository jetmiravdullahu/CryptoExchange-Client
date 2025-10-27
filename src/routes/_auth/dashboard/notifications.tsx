import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  MailOpen,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  getNotificationsQuery,
  useGetNotifications,
} from '@/hooks/api/Notifications/useGetNotifications'
import { useMarkAllReadMutation } from '@/hooks/api/Notifications/useMarkAllRead'
import { useMarkAsReadMutation } from '@/hooks/api/Notifications/useMarkAsRead'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/_auth/dashboard/notifications')({
  component: RouteComponent,
})

const severityColors = {
  SUCCESS: 'bg-green-500/10 text-green-500 border-green-500/20',
  ERROR: 'bg-red-500/10 text-red-500 border-red-500/20',
  WARNING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  INFO: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
}

function RouteComponent() {
  const queryClient = useQueryClient()
  const {
    data: notificationData,
    pagination,
    sorting,
    setPagination,
  } = useGetNotifications()

  const { mutateAsync: markAllAsRead } = useMarkAllReadMutation()
  const { mutate: markAsRead } = useMarkAsReadMutation()

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getNotificationsQuery({
            pagination,
            sorting,
          }).queryKey,
        })
      },
    })
  }
  const handleMarkAsRead = (id: string) => {
    markAsRead(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getNotificationsQuery({
            pagination,
            sorting,
          }).queryKey,
        })
      },
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your latest activities
            </p>
          </div>
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            <CheckCheck className="size-4 mr-2" />
            Mark all as read
          </Button>
        </div>
        <p className="text-foreground mt-1 mb-1">
          Total notifications: {notificationData.total}
        </p>
        <div className="space-y-3">
          {notificationData.data.length > 0 ? (
            notificationData.data.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-colors ${!notification.is_read ? 'bg-accent/30 border-accent' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-1">
                      {notification.is_read ? (
                        <MailOpen className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Mail className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-semibold ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <Badge variant="default" className="h-5 text-xs">
                            New
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`${severityColors[notification.severity]} text-xs`}
                        >
                          {notification.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{notification.type}</span>
                        <span>•</span>
                        <span>
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title={'Mark as read'}
                    >
                      <CheckCheck
                        className={`h-4 w-4 ${notification.is_read ? 'text-muted-foreground' : ''}`}
                      />
                      <span className="sr-only">{'Mark as read'}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No notifications yet</p>
            </Card>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                setPagination({
                  pageSize: Number(value),
                  pageIndex: 0,
                })
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">
              Page {pagination.pageIndex + 1} of {notificationData.last_page}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
                disabled={!pagination.pageIndex}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() =>
                  setPagination({
                    ...pagination,
                    pageIndex: pagination.pageIndex - 1,
                  })
                }
                disabled={!pagination.pageIndex}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() =>
                  setPagination({
                    ...pagination,
                    pageIndex: pagination.pageIndex + 1,
                  })
                }
                disabled={
                  pagination.pageIndex >= notificationData.last_page - 1
                }
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() =>
                  setPagination({
                    ...pagination,
                    pageIndex: notificationData.last_page - 1,
                  })
                }
                disabled={
                  pagination.pageIndex >= notificationData.last_page - 1
                }
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
