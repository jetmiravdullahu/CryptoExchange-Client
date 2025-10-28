import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer } from './ui/chart'
import type { ChartConfig } from './ui/chart'
import { cn } from '@/lib/utils'

interface BarChartWithCells {
  data: Array<Record<string, any>>
  xAxisKey: string
  config: ChartConfig
  className?: string
  assetColors: Record<string, string>
}

export const BarChartWithCells = ({
  data,
  xAxisKey,
  config,
  className,
  assetColors,
}: BarChartWithCells) => {
  return (
    <ChartContainer config={config} className={cn('h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_balance" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={assetColors[entry.asset]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
