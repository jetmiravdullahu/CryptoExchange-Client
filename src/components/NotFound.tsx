import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { currentUserQuery } from '@/hooks/api/Auth/useGetCurrentUser'

export default function NotFound() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const onRedirectToApp = () => {
    const cachedUser = queryClient.getQueryData(currentUserQuery.queryKey)
    if (!cachedUser) {
      navigate({
        to: '/login',
      })
      return
    }

    if (cachedUser.user.role === 'SELLER') {
      navigate({ to: '/' })
      return
    }

    navigate({ to: '/dashboard/users' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Puzzle pieces */}
        <div className="relative inline-block">
          <div className="grid grid-cols-3 gap-2 text-6xl">
            <div className="animate-float" style={{ animationDelay: '0s' }}>
              🧩
            </div>
            <div className="animate-float" style={{ animationDelay: '0.2s' }}>
              🧩
            </div>
            <div className="animate-float" style={{ animationDelay: '0.4s' }}>
              🧩
            </div>
            <div className="animate-float" style={{ animationDelay: '0.6s' }}>
              🧩
            </div>
            <div className="text-8xl flex items-center justify-center">❓</div>
            <div className="animate-float" style={{ animationDelay: '0.8s' }}>
              🧩
            </div>
            <div className="animate-float" style={{ animationDelay: '1s' }}>
              🧩
            </div>
            <div className="animate-float" style={{ animationDelay: '1.2s' }}>
              🧩
            </div>
            <div className="animate-float" style={{ animationDelay: '1.4s' }}>
              🧩
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-black text-indigo-900 dark:text-indigo-100">
            Missing Path
          </h1>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            Something Doesn't Fit
          </p>
          <p className="text-base text-purple-600 dark:text-purple-400 max-w-md mx-auto">
            The page you're looking for isn't here. Let's piece things together
            and get you back on track.
          </p>
        </div>

        <Button
          variant="ghost"
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          onClick={onRedirectToApp}
        >
          🧩 Redirect to app
        </Button>
      </div>
    </div>
  )
}
