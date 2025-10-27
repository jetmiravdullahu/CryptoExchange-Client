import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({
  size = 'lg',
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-1/2  w-full h-full  bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={cn('relative', sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        />
      </div>
    </div>
  )
}
