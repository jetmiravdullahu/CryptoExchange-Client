import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { useGetCurrentUser } from '@/hooks/api/Auth/useGetCurrentUser'

export const SellerHeader = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient() 
  const {data: currentUser} = useGetCurrentUser()

  const handleLogout = () => {
    localStorage.removeItem('token')
    queryClient.clear()
    navigate({
      to: '/login',
    })
  }

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Currency Exchange
        </h1>
        <p className="text-muted-foreground mt-1">
          Trade Euro and USDT instantly
        </p>
      </div>
      <div className="flex items-center gap-2">
        Welcome, {currentUser.user.name}
        <ThemeToggle />
        <Button
          variant="outline"
          onClick={handleLogout}
          className="gap-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
