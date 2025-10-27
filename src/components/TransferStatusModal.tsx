'use client'

import { useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Ban,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from 'lucide-react'
import type { ITransfer, TransferStatusActions } from '@/types/transfer'
import type { UserRole } from '@/types/user'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export type TransferStatus =
  | 'INITIATED'
  | 'IN_TRANSIT'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'RETURNED'
  | 'CANCELLED'

interface TransferStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transfer: ITransfer | null
  onStatusChange: (action: TransferStatusActions, reason?: string) => void
  currentUserRole: UserRole
  isIncoming: boolean
}

function getAvailableActions(
  status: TransferStatus,
  currentUserRole: UserRole,
  incoming = false,
): Array<TransferStatusActions> {
  switch (status) {
    case 'INITIATED':
      if (currentUserRole === 'SELLER' && incoming) return []
      return ['start_transit', 'cancel']
    case 'IN_TRANSIT': {
      if (currentUserRole === 'SELLER' && !incoming) {
        return []
      }

      if (currentUserRole === 'SELLER') {
        return ['confirm', 'reject']
      }

      return ['confirm', 'reject', 'return']
    }
    case 'REJECTED':
      return []
    case 'CONFIRMED':
      return []
    case 'RETURNED':
      return []
    case 'CANCELLED':
      return []
    default:
      return []
  }
}

function getActionConfig(action: TransferStatusActions) {
  switch (action) {
    case 'confirm':
      return {
        label: 'Confirm Transfer',
        icon: CheckCircle2,
        variant: 'default' as const,
        description: 'Mark this transfer as confirmed and completed',
      }
    case 'reject':
      return {
        label: 'Reject Transfer',
        icon: XCircle,
        variant: 'destructive' as const,
        description: 'Reject this transfer with a reason',
        requiresReason: true,
      }
    case 'return':
      return {
        label: 'Return Transfer',
        icon: RotateCcw,
        variant: 'secondary' as const,
        description: 'Return this transfer to the sender',
        requiresReason: true,
      }
    case 'cancel':
      return {
        label: 'Cancel Transfer',
        icon: Ban,
        variant: 'destructive' as const,
        description: 'Cancel this transfer permanently',
        requiresReason: true,
      }
    case 'start_transit':
      return {
        label: 'Start Transit',
        icon: ArrowRight,
        variant: 'default' as const,
        description: 'Move this transfer to in-transit status',
      }
  }
}

function getStatusVariant(status: TransferStatus) {
  switch (status) {
    case 'CONFIRMED':
      return 'default'
    case 'IN_TRANSIT':
    case 'INITIATED':
      return 'secondary'
    case 'REJECTED':
    case 'CANCELLED':
      return 'destructive'
    case 'RETURNED':
      return 'outline'
    default:
      return 'outline'
  }
}

export function TransferStatusModal({
  open,
  onOpenChange,
  transfer,
  onStatusChange,
  currentUserRole,
  isIncoming,
}: TransferStatusModalProps) {
  if (!transfer) return null
  const [selectedAction, setSelectedAction] =
    useState<TransferStatusActions | null>(null)
  const [reason, setReason] = useState('')

  const availableActions = getAvailableActions(
    transfer.status,
    currentUserRole,
    isIncoming,
  )

  const handleActionClick = (action: TransferStatusActions) => {
    const config = getActionConfig(action)
    if (config.requiresReason) {
      setSelectedAction(action)
    } else {
      onStatusChange(action)
      onOpenChange(false)
    }
  }

  const handleConfirmAction = () => {
    if (selectedAction) {
      onStatusChange(selectedAction, reason)
      setSelectedAction(null)
      setReason('')
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setSelectedAction(null)
    setReason('')
  }

  if (selectedAction) {
    const config = getActionConfig(selectedAction)
    const Icon = config.icon

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {config.label}
            </DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason{' '}
                {config.requiresReason && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                minLength={10}
              />
            </div>

            <div className="rounded-lg border border-border/50 bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Transfer ID:{' '}
                  <span className="font-mono font-medium text-foreground">
                    {transfer.id}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant={config.variant}
              onClick={handleConfirmAction}
              disabled={config.requiresReason && !reason.trim()}
            >
              Confirm {config.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Transfer Status</DialogTitle>
          <DialogDescription>
            Select an action to change the status of this transfer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/50 p-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Current Status</p>
              <p className="text-xs text-muted-foreground">
                Transfer ID: {transfer.id}
              </p>
            </div>
            <Badge variant={getStatusVariant(transfer.status)}>
              {transfer.status}
            </Badge>
          </div>

          {availableActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Ban className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No actions available for this status
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Available Actions</Label>
              <div className="grid gap-2">
                {availableActions.map((action) => {
                  const config = getActionConfig(action)
                  const Icon = config.icon
                  return (
                    <Button
                      key={action}
                      variant="outline"
                      className="justify-start hover:bg-primary/30! h-auto py-3 px-4 bg-transparent"
                      onClick={() => handleActionClick(action)}
                    >
                      <Icon className="h-4 w-4 mr-3 shrink-0" />
                      <div className="flex flex-col items-start text-left">
                        <span className="font-medium">{config.label}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {config.description}
                        </span>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
