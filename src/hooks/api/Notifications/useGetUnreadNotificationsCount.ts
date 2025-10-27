import { useQuery } from '@tanstack/react-query'
import { getUnreadNotificationsCount } from '@/api/Notification/getUnreadNotificationsCount'

export const useGetUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ['getUnreadNotificationsCount'],
    queryFn: getUnreadNotificationsCount,
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  })
}
