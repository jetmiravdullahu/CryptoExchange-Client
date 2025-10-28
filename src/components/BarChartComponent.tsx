import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {  ChartContainer } from './ui/chart'
import type {ChartConfig} from './ui/chart';
import { cn } from '@/lib/utils'

interface BarChartComponentProps {
  data: Array<Record<string, any>>
  dataKeys: Array<string>
  xAxisKey: string
  config: ChartConfig
  className?: string
}

export const BarChartComponent = ({
  data,
  dataKeys,
  xAxisKey,
  config,
  className,
}: BarChartComponentProps) => {
  return (
    <ChartContainer config={config} className={cn('h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          {dataKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              radius={[8, 8, 0, 0]}
              fill={config[key].color || '#000000'}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
