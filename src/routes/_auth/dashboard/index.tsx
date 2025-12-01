import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  AlertTriangle,
  BarChart,
  CheckCircle2,
  Coins,
  MapPin,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarChartComponent } from '@/components/BarChartComponent'
import { BarChartWithCells } from '@/components/BarChartWithCells'
import { PieChartComponent } from '@/components/PieChart'
import { DashboardCard } from '@/components/DashboardCard'
import {
  getDashboardStatsQuery,
  useGetDashboardStatsSuspenseQuery,
} from '@/hooks/api/Dashboard/getDashboardStats'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import { LoadingSpinner } from '@/components/LoadingComponent'

export const Route = createFileRoute('/_auth/dashboard/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getDashboardStatsQuery)
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
})

const ASSET_COLORS = (assets: Array<string>) => {
  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#f43f5e',
    '#84cc16',
    '#f97316',
    '#a855f7',
    '#14b8a6',
    '#ef4444',
    '#22c55e',
    '#eab308',
    '#6366f1',
  ]

  return assets.reduce(
    (acc, asset, index) => {
      acc[asset] = colors[index % colors.length]
      return acc
    },
    {} as Record<string, string>,
  )
}

function RouteComponent() {
  const { data: dashboardData } = useGetDashboardStatsSuspenseQuery()

  const raw = dashboardData.location_balances

  // build unique dataKeys from balances
  const dataKeys = Array.from(
    new Set(raw.flatMap((loc) => loc.balances.map((b) => b.asset))),
  )

  // transform to rows where each asset is a top-level numeric field
  const chartData = raw.map((loc) => {
    const row: Record<string, any> = { location_name: loc.location_name }
    loc.balances.forEach((b) => {
      row[b.asset] = Number(b.balance) || 0
    })
    return row
  })

  const dashboardCards = [
    {
      title: 'Active Locations',
      value: dashboardData.quick_stats.active_locations,
      icon: <MapPin className="h-4 w-4 text-muted-foreground" />,
      footer: 'Trading locations',
    },
    {
      title: 'Active Users',
      value: dashboardData.quick_stats.active_users,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      footer: 'System users',
    },
    {
      title: "Today's Transactions",
      value: dashboardData.quick_stats.todays_transactions,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      footer: (
        <div>
          <span
            className={
              dashboardData.todays_pnl.comparison.transactions_change_pct > 0
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {dashboardData.todays_pnl.comparison.transactions_change_pct > 0
              ? '+'
              : ''}
            {dashboardData.todays_pnl.comparison.transactions_change_pct}%
          </span>
          &nbsp;from yesterday
        </div>
      ),
    },
    {
      title: 'Active Assets',
      value: dashboardData.quick_stats.active_assets,
      icon: <Coins className="h-4 w-4 text-muted-foreground" />,
      footer: 'Tradeable currencies',
    },
    {
      title: "Today's Revenue",
      value: `$${dashboardData.todays_pnl.total_revenue.toFixed(2)}`,
      icon:
        dashboardData.todays_pnl.comparison.trend === 'down' ? (
          <TrendingDown className="h-4 w-4 text-red-500" />
        ) : (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ),
      footer: (
        <p className="text-xs text-muted-foreground">
          <span
            className={
              dashboardData.todays_pnl.comparison.revenue_change_pct < 0
                ? 'text-red-500'
                : 'text-green-500'
            }
          >
            {dashboardData.todays_pnl.comparison.revenue_change_pct > 0
              ? '+'
              : ''}
            {dashboardData.todays_pnl.comparison.revenue_change_pct}%
          </span>{' '}
          from yesterday
        </p>
      ),
    },
    {
      title: 'Total Volume',
      value: `$${dashboardData.todays_pnl.total_volume}`,
      icon: <BarChart className="h-4 w-4 text-muted-foreground" />,
      footer: 'Trading volume today',
    },
    {
      title: 'Avg Transaction',
      value: `$${dashboardData.todays_pnl.average_transaction_size.toFixed(2)}`,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      footer: 'Average transaction size',
    },
    {
      title: 'Average Fee',
      value: `$${dashboardData.todays_pnl.average_fee.toFixed(2)}`,
      icon: <Coins className="h-4 w-4 text-muted-foreground" />,
      footer: 'Average fee per transaction',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor your trading operations and financial metrics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-4 2xl:grid-cols-2">
        <Card className="max-w-full">
          <CardHeader className="">
            <CardTitle>Global Balances by Asset</CardTitle>
            <CardDescription>
              Total balance across all locations
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 md:px-6 ">
            <BarChartWithCells
              data={dashboardData.global_balances.by_asset}
              config={{
                balance: {
                  label: 'Balance',
                },
              }}
              xAxisKey="asset"
              assetColors={ASSET_COLORS(
                dashboardData.global_balances.by_asset.map(
                  (asset) => asset.asset,
                ),
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>Portfolio composition by asset</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChartComponent
              data={dashboardData.global_balances.by_asset}
              xAxisKey="total_balance"
              config={{}}
              assetColors={ASSET_COLORS(
                dashboardData.global_balances.by_asset.map(
                  (asset) => asset.asset,
                ),
              )}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 2xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Balance Types Breakdown</CardTitle>
            <CardDescription>
              Distribution of base, location, and transit balances by asset
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <BarChartComponent
              dataKeys={['base_balance', 'location_balance', 'transit_balance']}
              data={dashboardData.global_balances.by_asset}
              xAxisKey="asset"
              config={{
                base_balance: { label: 'Base Balance', color: '#3b82f6' },
                location_balance: {
                  label: 'Location Balance',
                  color: '#10b981',
                },
                transit_balance: { label: 'Transit Balance', color: '#f59e0b' },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location Balances</CardTitle>
            <CardDescription>Total balance by location</CardDescription>
          </CardHeader>
          <CardContent className="max-w-full">
            <BarChartComponent
              dataKeys={dataKeys}
              data={chartData}
              xAxisKey="location_name"
              config={
              dataKeys.reduce((acc, asset) => {
                acc[asset] = { label: asset, color: ASSET_COLORS(dataKeys)[asset] }
                return acc
              }, {} as Record<string, { label: string; color: string }>)
            }
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Pending Corrections
            </CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          {/* <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Pending</span>
              <Badge
                variant={
                  dashboardData.pending_corrections.total > 0
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {dashboardData.pending_corrections.total}
              </Badge>
            </div>
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Balance Mismatch</span>
                {dashboardData.pending_corrections.by_type && <span className="font-medium">
                  {dashboardData.pending_corrections.by_type.balance_mismatch}
                </span>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Missing Transaction
                </span>
                <span className="font-medium">
                  {
                    dashboardData.pending_corrections.by_type
                      .missing_transaction
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duplicate Entry</span>
                <span className="font-medium">
                  {dashboardData.pending_corrections.by_type.duplicate_entry}
                </span>
              </div>
            </div>
          </CardContent> */}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Reconciliation Status
            </CardTitle>
            <CardDescription>Daily reconciliation tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Today's Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Today's Progress</span>
                <Badge
                  variant={
                    dashboardData.reconciliation_status.today.completion_pct ===
                    100
                      ? 'default'
                      : dashboardData.reconciliation_status.today
                            .completion_pct > 0
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {dashboardData.reconciliation_status.today.completion_pct}%
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${dashboardData.reconciliation_status.today.completion_pct}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {dashboardData.reconciliation_status.today.reconciled} /{' '}
                  {dashboardData.reconciliation_status.today.total_accounts}{' '}
                  accounts
                </span>
                <span>
                  {dashboardData.reconciliation_status.today.pending} pending
                </span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Unreconciled Snapshots
                </span>
                <span
                  className={`font-medium ${
                    dashboardData.reconciliation_status
                      .unreconciled_snapshots_count > 0
                      ? 'text-amber-600'
                      : 'text-green-600'
                  }`}
                >
                  {
                    dashboardData.reconciliation_status
                      .unreconciled_snapshots_count
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Unreconciled Days</span>
                <span
                  className={`font-medium ${
                    dashboardData.reconciliation_status
                      .unreconciled_days_count > 0
                      ? 'text-amber-600'
                      : 'text-green-600'
                  }`}
                >
                  {dashboardData.reconciliation_status.unreconciled_days_count}
                </span>
              </div>
              {dashboardData.reconciliation_status.unreconciled_dates.length >
                0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    Unreconciled dates:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {dashboardData.reconciliation_status.unreconciled_dates.map(
                      (date, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {new Date(date).toLocaleDateString()}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              System Alerts
            </CardTitle>
            <CardDescription>Active system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-sm font-medium">No Active Alerts</p>
                <p className="text-xs text-muted-foreground">
                  All systems operating normally
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {dashboardData.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        className={`h-4 w-4 mt-0.5 ${
                          alert.severity === 'high'
                            ? 'text-red-500'
                            : alert.severity === 'medium'
                              ? 'text-amber-500'
                              : 'text-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              alert.severity === 'high'
                                ? 'destructive'
                                : alert.severity === 'medium'
                                  ? 'default'
                                  : 'secondary'
                            }
                            className="text-xs"
                          >
                            {alert.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {alert.count} {alert.count === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        <p className="text-sm">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* In Transit & Recent Activity */}
      <div className="grid gap-4">
        {/* In Transit Queue */}
        <Card>
          <CardHeader>
            <CardTitle>In Transit Queue</CardTitle>
            <CardDescription>Transfers currently in transit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total In Transit</p>
                <p className="text-2xl font-bold">
                  {dashboardData.in_transit_queue.total_in_transit}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Within SLA</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.in_transit_queue.within_sla}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm font-medium text-red-600">
                  Exceeding SLA
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardData.in_transit_queue.exceeding_sla}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recent_activity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.ref}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.type === 'transaction' ? (
                        <>
                          {activity.from_asset} → {activity.to_asset} •{' '}
                          {activity.location}
                        </>
                      ) : (
                        <>
                          {activity.from_location} → {activity.to_location} •
                          Asset: {activity.asset}
                        </>
                      )}
                    </p>
                    <Badge
                      variant={
                        activity.status === 'CANCELLED' ||
                        activity.status === 'TIMED_OUT'
                          ? 'destructive'
                          : 'default'
                      }
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {activity.type === 'transaction'
                        ? activity.from_amount
                        : activity.amount}
                    </p>
                    {activity.type === 'transaction' && (
                      <p className="text-xs text-muted-foreground">
                        Fee: {activity.fee}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
