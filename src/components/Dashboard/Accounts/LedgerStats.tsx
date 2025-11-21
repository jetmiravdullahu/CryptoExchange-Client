import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Coins,
  Send,
  SmilePlus,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react'
import type { IAccountLedgerStats } from '@/types/accountLedger'
import { MetricCard } from '@/components/MetricCard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'

export const LedgerStats = ({
  statsData,
}: {
  statsData: IAccountLedgerStats
}) => {
  const dailyAverageData = [
    {
      name: 'Credits/Day',
      value: Number.parseFloat(statsData.daily_averages.credits_per_day) || 0,
    },
    {
      name: 'Debits/Day',
      value: Number.parseFloat(statsData.daily_averages.debits_per_day) || 0,
    },
  ]

  const balanceHistoryData = [
    {
      date: 'Opening',
      balance: Number.parseFloat(statsData.opening_balance) || 0,
    },
    {
      date: 'Closing',
      balance: Number.parseFloat(statsData.closing_balance) || 0,
    },
  ]

  const isPositive = Number.parseFloat(statsData.net_change) >= 0

  const walletIcon = <Wallet className="w-6 h-6 text-blue-400" />
  const trendIcon = isPositive ? (
    <TrendingUp className="w-6 h-6 text-green-400" />
  ) : (
    <TrendingDown className="w-6 h-6 text-red-400" />
  )
  const incomingIcon = <ArrowDownLeft className="w-6 h-6 text-green-400" />
  const outgoingIcon = <ArrowUpRight className="w-6 h-6 text-purple-400" />
  const feesIcon = <Coins className="w-6 h-6 text-yellow-400" />

  const netChangePercentage =
    Number.parseFloat(statsData.net_change_percentage) || 0

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard
          title="Current Balance"
          value={`${parseFloat(statsData.account.current_balance).toFixed(6)} ${statsData.account.asset_name}`}
          icon={walletIcon}
          gradient="from-blue-900 to-slate-900"
          valueColor="text-blue-400"
        />

        <MetricCard
          title="Net Change"
          value={`${isPositive ? '+' : ''}${statsData.net_change}`}
          description={`${netChangePercentage}%`}
          icon={trendIcon}
          gradient={
            isPositive
              ? 'from-green-900 to-slate-900'
              : 'from-red-900 to-slate-900'
          }
          valueColor={isPositive ? 'text-green-400' : 'text-red-400'}
        />

        <MetricCard
          title="Total Credits"
          value={statsData.totals.total_credits}
          description={`${statsData.totals.entry_count} entries`}
          icon={incomingIcon}
          gradient="from-emerald-900 to-slate-900"
          valueColor="text-emerald-400"
        />

        <MetricCard
          title="Total Debits"
          value={statsData.totals.total_debits}
          description="Outgoing"
          icon={outgoingIcon}
          gradient="from-purple-900 to-slate-900"
          valueColor="text-purple-400"
        />
        <MetricCard
          title="Fees Collected"
          value={statsData.by_type.transactions.fees_collected}
          description="Collected from transactions"
          icon={feesIcon}
          gradient="from-yellow-900 to-slate-900"
          valueColor="text-yellow-400"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className=" border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Balance Overview</CardTitle>
            <CardDescription>Opening vs Closing Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                balance: { label: 'Balance', color: 'hsl(var(--chart-1))' },
              }}
              className="h-80 max-w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={balanceHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-700 rounded p-2">
                            <p className="text-sm text-white">
                              {statsData.account.asset_name}{' '}
                              {Number(payload[0]?.value).toFixed(2)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="balance" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Daily Averages */}
        <Card className=" border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Daily Averages</CardTitle>
            <CardDescription>Per day metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: 'Amount', color: 'hsl(var(--chart-2))' },
              }}
              className="h-80 max-w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyAverageData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-700 rounded p-2">
                            <p className="text-sm text-white">
                              {statsData.account.asset_name}{' '}
                              {Number(payload[0]?.value).toFixed(2)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            name: 'Manual Adjustments',
            net:
              Number.parseFloat(statsData.by_type.manual_adjustments.net) || 0,
            description: `Credits: ${statsData.by_type.manual_adjustments.credits}`,
            icon: <SmilePlus className="w-6 h-6 text-amber-400" />,
          },
          {
            name: 'Transfers',
            net: Number.parseFloat(statsData.by_type.transfers.net) || 0,
            description: `Out: ${statsData.by_type.transfers.transfers_out.amount}`,
            icon: <Send className="w-6 h-6 text-orange-400" />,
          },
          {
            name: 'Transactions',
            net: Number.parseFloat(statsData.by_type.transactions.net) || 0,
            // description: `Count: ${statsData.by_type.transactions.count}`,
            description: (
              <div>
                <div>Count: {statsData.by_type.transactions.count}</div>
                <div>
                  Fees Collected:{' '}
                  {statsData.by_type.transactions.fees_collected}
                </div>
              </div>
            ),
            icon: <Zap className="w-6 h-6 text-cyan-400" />,
          },
          {
            name: 'Corrections',
            net: Number.parseFloat(statsData.by_type.corrections.net) || 0,
            description: `Count: ${statsData.by_type.corrections.count}`,
            icon: <CheckCircle2 className="w-6 h-6 text-teal-400" />,
          },
        ].map((type) => (
          <Card key={type.name} className=" border-slate-700">
            <CardHeader>
              <CardDescription className="text-slate-400 flex justify-between items-center">
                {type.name}
                <p
                  className={`text-2xl font-bold ${type.net >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {type.net >= 0 ? '+' : ''}
                  {type.net.toFixed(2)}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {type.icon}
                <div>
                  <p className="text-xs text-slate-400">{type.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Largest Credit */}
        {statsData.largest_entries.largest_credit && (
          <Card className="bg-gradient-to-br from-chart-3 to-chart-4 border-slate-700">
            <CardHeader>
              <CardDescription className="text-foreground">
                Largest Credit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-bold text-green-400">
                +{statsData.largest_entries.largest_credit.amount}
              </p>
              <p className="text-sm text-foreground">
                {statsData.largest_entries.largest_credit.reference_type}
              </p>
              <p className="text-xs text-foreground/70">
                {statsData.largest_entries.largest_credit.date}
              </p>
              <p className="text-xs italic text-foreground">
                {statsData.largest_entries.largest_credit.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Largest Debit */}
        {statsData.largest_entries.largest_debit && (
          <Card className="bg-gradient-to-br from-chart-1 to-chart-2 border-slate-700">
            <CardHeader>
              <CardDescription className="text-foreground">
                Largest Debit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-bold text-red-400">
                -{statsData.largest_entries.largest_debit.amount}
              </p>
              <p className="text-sm text-foreground">
                {statsData.largest_entries.largest_debit.reference_type}
              </p>
              <p className="text-xs text-foreground/70">
                {statsData.largest_entries.largest_debit.date}
              </p>
              <p className="text-xs italic text-foreground">
                {statsData.largest_entries.largest_debit.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
