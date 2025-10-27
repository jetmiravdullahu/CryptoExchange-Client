import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '@/hooks/ThemeProvider'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="bg-transparent"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}
