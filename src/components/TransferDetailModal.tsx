'use client'

import { format } from 'date-fns'
import {
  Calendar,
  FileText,
  Hash,
  MapPin,
  User,
  Wallet,
  XCircle,
} from 'lucide-react'
import type { ITransfer, TransferStatus } from '@/types/transfer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TransferDetailModalProps {
  transfer: ITransfer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getStatusVariant(status: TransferStatus) {
  switch (status) {
    case 'CONFIRMED':
      return 'default'
    case 'IN_TRANSIT':
      return 'secondary'
    case 'REJECTED':
      return 'destructive'
    case 'RETURNED':
      return 'outline'
    default:
      return 'outline'
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return '—'
  return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm:ss")
}

function formatAmount(amount: string, decimals: number) {
  return parseFloat(amount).toFixed(decimals)
}

export function TransferDetailModal({
  transfer,
  open,
  onOpenChange,
}: TransferDetailModalProps) {
  if (!transfer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transfer Details
          </DialogTitle>
          <DialogDescription>
            Reference: {transfer.transfer_ref}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Status and Type */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={getStatusVariant(transfer.status)}
                  className="text-sm"
                >
                  {transfer.status}
                </Badge>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">Transfer Type</p>
                <Badge variant="outline" className="text-sm">
                  {transfer.transfer_type}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Amount and Asset */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Amount & Asset</h3>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono">
                    {formatAmount(transfer.amount, transfer.asset.precision)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {transfer.asset.name}
                </p>
              </div>
            </div>


            <Separator />

            {/* Locations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Locations</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {transfer.from_location ? (
                  <div className="space-y-2 rounded-lg border p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      FROM LOCATION
                    </p>
                    <p className="font-medium">{transfer.from_location.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {transfer.from_location.address}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 rounded-lg border p-4 opacity-50">
                    <p className="text-xs font-medium text-muted-foreground">
                      FROM LOCATION
                    </p>
                    <p className="text-sm">BASE</p>
                  </div>
                )}
                <div className="space-y-2 rounded-lg border p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    TO LOCATION
                  </p>
                  <p className="font-medium">{transfer.to_location.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {transfer.to_location.address}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Timeline</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start py-2">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(transfer.created_at)}
                  </span>
                </div>
                {transfer.in_transit_at && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">In Transit</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(transfer.in_transit_at)}
                    </span>
                  </div>
                )}
                {transfer.confirmed_at && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">Confirmed</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(transfer.confirmed_at)}
                    </span>
                  </div>
                )}
                {transfer.rejected_at && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">Rejected</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(transfer.rejected_at)}
                    </span>
                  </div>
                )}
                {transfer.returned_at && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">Returned</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(transfer.returned_at)}
                    </span>
                  </div>
                )}
                {transfer.cancelled_at && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">Cancelled</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(transfer.cancelled_at)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start py-2">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(transfer.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* User Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">User Actions</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start py-2">
                  <span className="text-sm font-medium">Initiated By</span>
                  <div className="text-right">
                    <p className="text-sm">{transfer.initiated_by.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {transfer.initiated_by.email}
                    </p>
                  </div>
                </div>
                {transfer.confirmed_by && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">Confirmed By</span>
                    <div className="text-right">
                      <p className="text-sm">{transfer.confirmed_by.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {transfer.confirmed_by.email}
                      </p>
                    </div>
                  </div>
                )}
                {transfer.rejected_by && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">Rejected By</span>
                    <div className="text-right">
                      <p className="text-sm">{transfer.rejected_by.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {transfer.rejected_by.email}
                      </p>
                    </div>
                  </div>
                )}
                {transfer.returned_by && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">Returned By</span>
                    <div className="text-right">
                      <p className="text-sm">{transfer.returned_by.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {transfer.returned_by.email}
                      </p>
                    </div>
                  </div>
                )}
                {transfer.cancelled_by && (
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">Cancelled By</span>
                    <div className="text-right">
                      <p className="text-sm">{transfer.cancelled_by.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {transfer.cancelled_by.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Reason */}
            {transfer.rejection_reason && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <h3 className="font-semibold">Rejection Reason</h3>
                  </div>
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm">{transfer.rejection_reason}</p>
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {transfer.notes && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Notes</h3>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm whitespace-pre-wrap">
                      {transfer.notes}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Metadata */}
            {transfer.metadata && Object.keys(transfer.metadata).length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Metadata</h3>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(transfer.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            )}

            {/* IDs Section */}
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">System IDs</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Transfer ID</span>
                  <span className="font-mono">{transfer.id}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">From Account ID</span>
                  <span className="font-mono">{transfer.from_account_id}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">To Account ID</span>
                  <span className="font-mono">{transfer.to_account_id}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Asset ID</span>
                  <span className="font-mono">{transfer.asset_id}</span>
                </div>
                {transfer.from_location_id && (
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">
                      From Location ID
                    </span>
                    <span className="font-mono">
                      {transfer.from_location_id}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">To Location ID</span>
                  <span className="font-mono">{transfer.to_location_id}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
