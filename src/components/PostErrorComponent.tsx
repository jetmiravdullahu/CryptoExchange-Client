import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Button } from './ui/button'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function PostErrorComponent({ error, reset }: ErrorComponentProps) {
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  const parsedError = (() => {
    try {
      return JSON.parse(error.message)
    } catch {
      return null
    }
  })()

  return (
    <div className="h-full bg-transparent flex items-center justify-center w-full p-4">
      <div className="text-center space-y-12 max-w-xl">
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 border-4 border-slate-300 dark:border-slate-700 rounded-full" />
          <div className="absolute inset-4 border-2 border-slate-400 dark:border-slate-600 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-light text-slate-600 dark:text-slate-400">
              ?
            </span>
          </div>
        </div>
        {Array.isArray(parsedError) ? (
          parsedError.map((item: any, index) => (
            <p key={index}>
              {item?.message ??
                error.message ??
                "We encountered an unexpected error. Take a deep breath, and let's try again."}
            </p>
          ))
        ) : (
          <p>
            {parsedError?.message ??
              error.message ??
              "We encountered an unexpected error. Take a deep breath, and let's try again."}
          </p>
        )}
        <Button
          onClick={reset}
          variant="ghost"
          className="px-10 py-3 border-2 border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200 font-light rounded-full transition-all hover:bg-slate-800 hover:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}
