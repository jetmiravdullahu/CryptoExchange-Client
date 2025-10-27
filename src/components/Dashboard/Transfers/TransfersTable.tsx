import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import { Pagination } from '../../Pagination'
import { Badge } from '../../ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import type {
  ITransfer,
  TransferStatus,
  TransferStatusActions,
} from '@/types/transfer'
import type { UserRole } from '@/types/user'
import { Button } from '@/components/ui/button'
import { TransferStatusModal } from '@/components/TransferStatusModal'
import { useStartTransitMutation } from '@/hooks/api/Transfer/useStartTransit'
import { useRejectTransferMutation } from '@/hooks/api/Transfer/useRejectTransfer'
import { useConfirmTransferMutation } from '@/hooks/api/Transfer/useConfirmTransfer'
import { useReturnTransferMutation } from '@/hooks/api/Transfer/useReturnTransfer'
import { useCancelTransferMutation } from '@/hooks/api/Transfer/useCancelTransfer'
import { getTransfersQuery } from '@/hooks/api/Transfer/useGetTransfers'
import { cn } from '@/lib/utils'
import { getAccountsQuery } from '@/hooks/api/Account/useGetAccounts'

export const TransfersTable = ({
  transfers,
  totalTransfers,
  pagination,
  setPagination,
  sorting,
  setSorting,
  onViewTransfer,
  sellerLocation,
  currentUserRole,
}: {
  transfers: Array<ITransfer>
  totalTransfers: number
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  onViewTransfer: (transfer: ITransfer) => void
  sellerLocation?: string
  currentUserRole: UserRole
}) => {
  const queryClient = useQueryClient()
  const [statusChangeTransaction, setStatusChangeTransaction] =
    useState<ITransfer | null>(null)

  const { mutateAsync: startTransit } = useStartTransitMutation()
  const { mutateAsync: cancelTransfer } = useCancelTransferMutation()
  const { mutateAsync: rejectTransfer } = useRejectTransferMutation()
  const { mutateAsync: confirmTransfer } = useConfirmTransferMutation()
  const { mutateAsync: returnTransfer } = useReturnTransferMutation()

  const actionsMap: Record<TransferStatusActions, (reason?: string) => any> = {
    confirm: () =>
      statusChangeTransaction?.id &&
      confirmTransfer(statusChangeTransaction.id),
    cancel: (reason?: string) =>
      statusChangeTransaction?.id &&
      cancelTransfer({ id: statusChangeTransaction.id, reason }),
    reject: (reason?: string) =>
      statusChangeTransaction?.id &&
      rejectTransfer({ id: statusChangeTransaction.id, reason: reason || '' }),
    start_transit: () =>
      statusChangeTransaction?.id && startTransit(statusChangeTransaction.id),
    return: (reason?: string) =>
      statusChangeTransaction?.id &&
      returnTransfer({ id: statusChangeTransaction.id, reason: reason || '' }),
  }

  const onStatusChangeHandler = async (
    action: TransferStatusActions,
    reason?: string,
  ) => {
    const actionFn = actionsMap[action]
    await actionFn(reason)
    queryClient.invalidateQueries({ queryKey: getTransfersQuery().queryKey })
    queryClient.invalidateQueries({ queryKey: getAccountsQuery.queryKey })

    setStatusChangeTransaction(null)
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

  const columns = useMemo<Array<ColumnDef<ITransfer, any>>>(
    () => [
      {
        accessorKey: 'type',
        cell: ({ row }) => {
          if (currentUserRole !== 'SELLER') return null
          return (
            <span>
              {sellerLocation === row.original.from_location_id ? (
                <ArrowDownLeft className="h-4 w-4" />
              ) : sellerLocation === row.original.to_location_id ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : null}
            </span>
          )
        },
        header: () => <span></span>,
      },
      {
        accessorKey: 'transfer_type',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        header: () => <span>From</span>,
      },
      {
        accessorKey: 'from_location',
        cell: (info) => info.getValue()?.name || 'BASE',
        header: () => <span>From Location</span>,
      },
      {
        accessorKey: 'to_location',
        cell: (info) => info.getValue().name,
        header: () => <span>To Location</span>,
      },
      {
        accessorKey: 'asset',
        cell: (info) => info.getValue().name,
        header: () => <span>Asset</span>,
      },
      {
        accessorKey: 'amount',
        cell: (info) => parseFloat(info.getValue()).toFixed(2),
        header: () => <span>Amount</span>,
      },
      {
        accessorKey: 'status',
        cell: (info) => (
          <Badge variant={getStatusVariant(info.getValue())}>
            {info.getValue()}
          </Badge>
        ),
        header: () => <span>Status</span>,
      },
      {
        accessorKey: 'notes',
        cell: (info) => {
          const reason = info.getValue()

          if (!reason) {
            return <div className="text-sm text-muted-foreground">—</div>
          }

          return (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="max-w-[200px] cursor-help">
                    <div className="text-sm text-muted-foreground truncate">
                      {reason}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[300px] h-min wrap-break-word"
                >
                  <p>{reason}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
        header: () => <span>Cancelled Reason</span>,
      },
      {
        id: 'actions',
        cell: (info) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => onViewTransfer(info.row.original)}
            >
              <Eye />
            </Button>
            <Button
              variant="ghost"
              className="p-0"
              onClick={(e) => {
                e.stopPropagation()
                setStatusChangeTransaction(info.row.original)
              }}
            >
              <FileText />
            </Button>
          </div>
        ),
        header: () => <div className="text-right">Actions</div>,
      },
    ],
    [],
  )

  const onSortHandler = (arg: any) => {
    setSorting(arg())
  }

  const table = useReactTable({
    data: transfers,
    columns,
    rowCount: totalTransfers,
    manualPagination: true,
    state: {
      pagination,
      sorting,
    },
    meta: {
      total: totalTransfers,
    },
    onPaginationChange: setPagination,
    onSortingChange: onSortHandler,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none hover:text-blue-400 transition-colors'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="inline-block h-4 w-4 ml-2" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="inline-block h-4 w-4 ml-2" />
                        ) : null}
                      </div>
                    </>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    'cursor-pointer',
                    sellerLocation === row.original.to_location_id &&
                      'bg-primary/15',
                  )}
                  onClick={() => onViewTransfer(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                No transfers were found. Add your first transfer to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="h-4" />
      <Pagination table={table} />
      <TransferStatusModal
        open={!!statusChangeTransaction}
        onOpenChange={(open) => {
          if (!open) {
            setStatusChangeTransaction(null)
          }
        }}
        transfer={statusChangeTransaction}
        onStatusChange={onStatusChangeHandler}
        currentUserRole={currentUserRole}
        isIncoming={sellerLocation === statusChangeTransaction?.to_location_id}
      />
    </>
  )
}
