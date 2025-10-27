import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../../../api/Auth/currentUser'

export const currentUserQuery = queryOptions({
  queryKey: ['currentUser'],
  queryFn: getCurrentUser,
})

export const useGetCurrentUser = () => {
  return useSuspenseQuery(currentUserQuery)
}
