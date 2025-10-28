import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ChartContainer } from './ui/chart'
import type { ChartConfig } from './ui/chart'
import { cn } from '@/lib/utils'

interface PieChartComponentProps {
  data: Array<Record<string, any>>
  xAxisKey: string
  config: ChartConfig
  className?: string
  assetColors: Record<string, string>
}

export const PieChartComponent = ({
  data,
  xAxisKey,
  config,
  className,
  assetColors,
}: PieChartComponentProps) => {
  // coerce numeric values and ensure an explicit color for each slice
  const chartData = data.map((d) => ({
    ...d,
    // ensure the dataKey is a number
    [xAxisKey]: Number(d[xAxisKey]) || 0,
  }))

  return (
    <ChartContainer config={config} className={cn('h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey={xAxisKey}
            nameKey="asset"
            cx="50%"
            cy="50%"
            outerRadius={100}
            // disable animations while debugging
            isAnimationActive={false}
            label
          >
            {chartData.map((entry, index) => {
              const color = assetColors[entry.asset] // fallback color
              return <Cell key={`cell-${entry.asset ?? index}`} fill={color} />
            })}
          </Pie>
          <Tooltip
            formatter={(value: any) =>
              typeof value === 'number' ? value.toLocaleString() : value
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
