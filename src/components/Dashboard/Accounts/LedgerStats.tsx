import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Send,
  SmilePlus,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react'
import { DashboardCard } from '@/components/DashboardCard'
import { useGetAccountLedgerStats } from '@/hooks/api/AccountLedger/useGetAccountLedgerStats'
import { Route } from '@/routes/_auth/dashboard/accounts/$accountId.ledger'
import { MetricCard } from '@/components/MetricCard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'

export const LedgerStats = () => {
  const { accountId } = Route.useParams()

  const { data: statisticsData } = useGetAccountLedgerStats(accountId)

  const dashboardCards = [
    {
      title: 'Opening Balance',
      value: statisticsData.opening_balance,
      footer: '',
      icon: '💰',
    },
    {
      title: 'Closing Balance',
      value: statisticsData.closing_balance,
      footer: '',
      icon: '💰',
    },
    {
      title: 'Net Change',
      value: statisticsData.net_change,
      footer: '',
      icon: '💰',
    },
    {
      title: 'Total Credits',
      value: statisticsData.totals.total_credits,
      footer: '',
      icon: '💰',
    },
    {
      title: 'Total Debits',
      value: statisticsData.totals.total_debits,
      footer: '',
      icon: '💰',
    },
  ]

  const transactionTypeData = [
    {
      name: 'Manual Adjustments',
      positive:
        Number.parseFloat(statisticsData.by_type.manual_adjustments.net) || 0,
      negative: 0,
      actual:
        Number.parseFloat(statisticsData.by_type.manual_adjustments.net) || 0,
    },
    {
      name: 'Transfers',
      positive: 0,
      negative: Math.abs(
        Number.parseFloat(statisticsData.by_type.transfers.net) || 0,
      ),
      actual: Number.parseFloat(statisticsData.by_type.transfers.net) || 0,
    },
    {
      name: 'Transactions',
      positive: Math.max(
        Number.parseFloat(statisticsData.by_type.transactions.net) || 0,
        0,
      ),
      negative: Math.abs(
        Math.min(
          Number.parseFloat(statisticsData.by_type.transactions.net) || 0,
          0,
        ),
      ),
      actual: Number.parseFloat(statisticsData.by_type.transactions.net) || 0,
    },
    {
      name: 'Corrections',
      positive: Math.max(
        Number.parseFloat(statisticsData.by_type.corrections.net) || 0,
        0,
      ),
      negative: Math.abs(
        Math.min(
          Number.parseFloat(statisticsData.by_type.corrections.net) || 0,
          0,
        ),
      ),
      actual: Number.parseFloat(statisticsData.by_type.corrections.net) || 0,
    },
  ]

  const dailyAverageData = [
    {
      name: 'Credits/Day',
      value:
        Number.parseFloat(statisticsData.daily_averages.credits_per_day) || 0,
    },
    {
      name: 'Debits/Day',
      value:
        Number.parseFloat(statisticsData.daily_averages.debits_per_day) || 0,
    },
  ]

  const balanceHistoryData = [
    {
      date: 'Opening',
      balance: Number.parseFloat(statisticsData.opening_balance) || 0,
    },
    {
      date: 'Closing',
      balance: Number.parseFloat(statisticsData.closing_balance) || 0,
    },
  ]

  const isPositive = Number.parseFloat(statisticsData.net_change) >= 0

  const walletIcon = <Wallet className="w-6 h-6 text-blue-400" />
  const trendIcon = isPositive ? (
    <TrendingUp className="w-6 h-6 text-green-400" />
  ) : (
    <TrendingDown className="w-6 h-6 text-red-400" />
  )
  const incomingIcon = <ArrowDownLeft className="w-6 h-6 text-green-400" />
  const outgoingIcon = <ArrowUpRight className="w-6 h-6 text-purple-400" />

  const netChangePercentage =
    Number.parseFloat(statisticsData.net_change_percentage) || 0

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Current Balance"
          value={`${statisticsData.account.current_balance} ${statisticsData.account.asset_name}`}
          icon={walletIcon}
          gradient="from-blue-900 to-slate-900"
          valueColor="text-blue-400"
        />

        <MetricCard
          title="Net Change"
          value={`${isPositive ? '+' : ''}${statisticsData.net_change}`}
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
          value={statisticsData.totals.total_credits}
          description={`${statisticsData.totals.entry_count} entries`}
          icon={incomingIcon}
          gradient="from-emerald-900 to-slate-900"
          valueColor="text-emerald-400"
        />

        <MetricCard
          title="Total Debits"
          value={statisticsData.totals.total_debits}
          description="Outgoing"
          icon={outgoingIcon}
          gradient="from-violet-900 to-slate-900"
          valueColor="text-violet-400"
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
              className="h-80"
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
                              {statisticsData.account.asset_name}{' '}
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
              className="h-80"
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
                              {statisticsData.account.asset_name}{' '}
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
              Number.parseFloat(
                statisticsData.by_type.manual_adjustments.net,
              ) || 0,
            description: `Credits: ${statisticsData.by_type.manual_adjustments.credits}`,
            icon: <SmilePlus className="w-6 h-6 text-amber-400" />,
          },
          {
            name: 'Transfers',
            net: Number.parseFloat(statisticsData.by_type.transfers.net) || 0,
            description: `Out: ${statisticsData.by_type.transfers.transfers_out.amount}`,
            icon: <Send className="w-6 h-6 text-orange-400" />,
          },
          {
            name: 'Transactions',
            net:
              Number.parseFloat(statisticsData.by_type.transactions.net) || 0,
            description: `Count: ${statisticsData.by_type.transactions.count}`,
            icon: <Zap className="w-6 h-6 text-cyan-400" />,
          },
          {
            name: 'Corrections',
            net: Number.parseFloat(statisticsData.by_type.corrections.net) || 0,
            description: `Count: ${statisticsData.by_type.corrections.count}`,
            icon: <CheckCircle2 className="w-6 h-6 text-teal-400" />,
          },
        ].map((type) => (
          <Card key={type.name} className=" border-slate-700">
            <CardHeader>
              <CardDescription className="text-slate-400">
                {type.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {type.icon}
                <div>
                  <p
                    className={`text-2xl font-bold ${type.net >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {type.net >= 0 ? '+' : ''}
                    {type.net.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400">{type.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction Details */}
      <div className="mb-8">
        <Card className="border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Transaction Summary</CardTitle>
            <CardDescription>Breakdown by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Transfers */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-700">
                <div>
                  <p className="font-semibold text-white">Transfers</p>
                  <p className="text-sm text-slate-400">
                    Out: {statisticsData.by_type.transfers.transfers_out.amount}
                  </p>
                </div>
                <p className="text-lg font-bold text-red-400">
                  {statisticsData.by_type.transfers.net}
                </p>
              </div>

              {/* Manual Adjustments */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-700">
                <div>
                  <p className="font-semibold text-white">Manual Adjustments</p>
                  <p className="text-sm text-slate-400">
                    Credits: {statisticsData.by_type.manual_adjustments.credits}
                  </p>
                </div>
                <p className="text-lg font-bold text-green-400">
                  +{statisticsData.by_type.manual_adjustments.net}
                </p>
              </div>

              {/* Transactions */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-700">
                <div>
                  <p className="font-semibold text-white">Transactions</p>
                  <p className="text-sm text-slate-400">
                    Count: {statisticsData.by_type.transactions.count}
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-400">
                  {statisticsData.by_type.transactions.net}
                </p>
              </div>

              {/* Corrections */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">Corrections</p>
                  <p className="text-sm text-slate-400">
                    Count: {statisticsData.by_type.corrections.count}
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-400">
                  {statisticsData.by_type.corrections.net}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Largest Credit */}
        <Card className="bg-gradient-to-br from-green-900/30 to-slate-900 border-slate-700">
          <CardHeader>
            <CardDescription className="text-slate-400">
              Largest Credit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-bold text-green-400">
              +{statisticsData.largest_entries.largest_credit.amount}
            </p>
            <p className="text-sm text-slate-400">
              {statisticsData.largest_entries.largest_credit.reference_type}
            </p>
            <p className="text-xs text-slate-500">
              {statisticsData.largest_entries.largest_credit.date}
            </p>
            <p className="text-xs italic text-slate-400">
              {statisticsData.largest_entries.largest_credit.description}
            </p>
          </CardContent>
        </Card>

        {/* Largest Debit */}
        <Card className="bg-gradient-to-br from-red-900/30 to-slate-900 border-slate-700">
          <CardHeader>
            <CardDescription className="text-slate-400">
              Largest Debit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-bold text-red-400">
              -{statisticsData.largest_entries.largest_debit.amount}
            </p>
            <p className="text-sm text-slate-400">
              {statisticsData.largest_entries.largest_debit.reference_type}
            </p>
            <p className="text-xs text-slate-500">
              {statisticsData.largest_entries.largest_debit.date}
            </p>
            <p className="text-xs italic text-slate-400">
              {statisticsData.largest_entries.largest_debit.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
