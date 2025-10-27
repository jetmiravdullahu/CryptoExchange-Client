import { useEffect, useState } from 'react'

export const TimerComponent = ({
  initialTime = 20,
  onExpire,
}: {
  initialTime?: number
  onExpire: () => void
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (prev === 1) onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
      <div
        className={`text-2xl font-mono font-bold ${timeLeft <= 60 ? 'text-destructive' : 'text-primary'}`}
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  )
}
