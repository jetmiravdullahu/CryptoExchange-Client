import type React from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface BalanceCardProps {
  currency: string
  balance: number
  icon?: React.ReactNode
}

export function BalanceCard({ currency, balance, icon }: BalanceCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {currency} Balance
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
