import {
  ArrowRight,
  Clock,
  Hash,
  Mail,
  MapPin,
  Phone,
  Receipt,
  TrendingUp,
  User,
  XCircle,
} from 'lucide-react'
import type { ITransaction } from '@/types/transaction'
import type { IAsset } from '@/types/asset'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface TransactionDetailsModalProps {
  open: boolean
  onClose: () => void

  transaction: ITransaction | null
}

export function TransactionDetailsModal({
  open,
  onClose,
  transaction,
}: TransactionDetailsModalProps) {
  if (!transaction) return null

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAmount = (amount: string, asset: IAsset) => {
    const num = Number.parseFloat(amount)
    const symbol = asset.metadata.display_symbol || asset.code
    return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${symbol}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'FAILED':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Transaction Details</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                {transaction.transaction_ref}
              </p>
            </div>
            <Badge className={`${getStatusColor(transaction.status)} border`}>
              {transaction.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Transaction Amount Section */}
          <div className="bg-muted/50 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  From
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatAmount(
                    transaction.from_amount,
                    transaction.from_asset,
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.from_asset.name}
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {transaction.from_asset.asset_class}
                </Badge>
              </div>

              <div className="px-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  To
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatAmount(transaction.to_amount, transaction.to_asset)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.to_asset.name}
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {transaction.to_asset.asset_class}
                </Badge>
              </div>
            </div>
          </div>

          {/* Exchange Rate & Fees */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Exchange Rate
                </p>
              </div>
              <p className="text-lg font-semibold">
                1 {transaction.from_asset.code} ={' '}
                {Number.parseFloat(transaction.rate_value).toFixed(6)}{' '}
                {transaction.to_asset.code}
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Fee Applied
                </p>
              </div>
              <p className="text-lg font-semibold text-red-400">
                -{Number.parseFloat(transaction.fee_flat).toFixed(2)}{' '}
                {transaction.to_asset.code}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.fee_basis_type} ({transaction.fee_basis_value}
                {transaction.fee_basis_type === 'PCT' ? '%' : ''})
              </p>
            </div>
          </div>

          {/* Cancellation Reason */}
          {transaction.cancellation_reason && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm font-medium text-red-400">
                  Cancellation Reason
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {transaction.cancellation_reason}
              </p>
            </div>
          )}

          <Separator />

          {/* Location Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Location</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{transaction.location.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.location.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.location.city},{' '}
                    {transaction.location.country_code}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {transaction.location.code}
                </Badge>
              </div>
              {(transaction.location.metadata.phone ||
                transaction.location.metadata.email) && (
                <div className="flex gap-4 mt-3 pt-3 border-t border-border/50">
                  {transaction.location.metadata.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {transaction.location.metadata.phone}
                    </div>
                  )}
                  {transaction.location.metadata.email && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {transaction.location.metadata.email}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Customer Info (if available) */}
          {(transaction.customer_name ||
            transaction.customer_phone ||
            transaction.customer_email) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">Customer</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                {transaction.customer_name && (
                  <p className="font-semibold">{transaction.customer_name}</p>
                )}
                <div className="flex gap-4 mt-1">
                  {transaction.customer_phone && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {transaction.customer_phone}
                    </div>
                  )}
                  {transaction.customer_email && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {transaction.customer_email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Created By / Updated By */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">Created By</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="font-semibold">{transaction.created_by.name}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.created_by.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {transaction.created_by.role}
                  </Badge>
                  {transaction.created_by.metadata.seller_info && transaction.created_by.metadata.seller_info.employee_id && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {transaction.created_by.metadata.seller_info.employee_id}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {transaction.updated_by && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Updated By</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="font-semibold">{transaction.updated_by.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.updated_by.email}
                  </p>
                  <Badge variant="outline" className="text-xs mt-2">
                    {transaction.updated_by.role}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          {Object.keys(transaction.metadata).length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Metadata</h3>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(transaction.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Timestamps */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Timeline</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="text-sm font-medium">
                  {formatDate(transaction.created_at)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Updated At</p>
                <p className="text-sm font-medium">
                  {formatDate(transaction.updated_at)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Rate Locked At</p>
                <p className="text-sm font-medium">
                  {formatDate(transaction.rate_locked_at)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Rate Expires At</p>
                <p className="text-sm font-medium">
                  {formatDate(transaction.rate_expires_at)}
                </p>
              </div>
              {transaction.completed_at && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-xs text-emerald-400">Completed At</p>
                  <p className="text-sm font-medium text-emerald-400">
                    {formatDate(transaction.completed_at)}
                  </p>
                </div>
              )}
              {transaction.cancelled_at && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs text-red-400">Cancelled At</p>
                  <p className="text-sm font-medium text-red-400">
                    {formatDate(transaction.cancelled_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction ID */}
          <div className="bg-muted/20 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Transaction ID</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              {transaction.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
