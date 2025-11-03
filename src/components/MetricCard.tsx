import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  gradient?: string
  valueColor?: string
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  gradient = "from-slate-800 to-slate-900",
  valueColor = "text-white",
}: MetricCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} border-slate-700`}>
      <CardHeader>
        <CardDescription className="text-slate-400">{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="flex-1">
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            {description && <p className="text-xs text-slate-400">{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
