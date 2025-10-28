import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface DashboardCardProps {
  value: string | number
  title: string
  icon: React.ReactNode
  footer?: React.ReactNode
}

export const DashboardCard = ({ value, title, icon, footer }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{footer}</p>
      </CardContent>
    </Card>
  )
}
