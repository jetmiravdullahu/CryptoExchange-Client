export interface IUnreadNotificationCountResponse {
    unread_count: number
}

export type NotificationSeverity = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR'

export interface INotification {
    id: string
    user_id: string
    title: string
    message: string
    type: string
    severity: NotificationSeverity  
    entity_type: string
    entity_id: string
    is_read: boolean
    read_at: string | null
    data: Record<string, any>
    created_at: string
}