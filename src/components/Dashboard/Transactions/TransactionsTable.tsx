import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo } from 'react'
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
  ITransaction,
  TransactionStatusType,
} from '@/types/transaction'

export const TransactionsTable = ({
  transactions,
  totalTransactions,
  pagination,
  setPagination,
  sorting,
  setSorting,
  onRowClick,
}: {
  transactions: Array<ITransaction>
  totalTransactions: number
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  onRowClick?: (transaction: ITransaction) => void
}) => {
  function getStatusVariant(status: TransactionStatusType) {
    switch (status) {
      case 'COMPLETED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  function getBuySellVariant(isFiat: boolean) {
    return isFiat ? 'default' : 'destructive'
  }

  const columns = useMemo<Array<ColumnDef<ITransaction, any>>>(
    () => [
      {
        accessorKey: 'type',
        cell: ({ row }) => {
          return (
            <span>
              <Badge
                variant={getBuySellVariant(
                  row.original.to_asset.asset_class === 'FIAT',
                )}
              >
                {row.original.to_asset.asset_class === 'FIAT'
                  ? 'Buying'
                  : 'Selling'}
              </Badge>
            </span>
          )
        },
        header: () => <span></span>,
      },
      {
        accessorKey: 'from_asset',
        cell: ({row, getValue}) => (
          <span className="font-medium">
            {parseFloat(row.original.from_amount).toFixed(2)}{' '}
            {getValue().name}
          </span>
        ),
        header: () => <span>From</span>,
      },
      {
        accessorKey: 'to_asset',
        cell: ({row, getValue}) => (
          <span className="font-medium">
            {parseFloat(row.original.to_amount).toFixed(2)}{' '}
            {getValue().name}
          </span>
        ),
        header: () => <span>To</span>,
      },
      {
        accessorKey: 'rate_value',
        cell: (info) => parseFloat(info.getValue()).toFixed(2),
        header: () => <span>Rate</span>,
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
        accessorKey: 'cancelled_reason',
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
        accessorKey: 'location',
        cell: (info) => <span>{info.getValue().name}</span>,
        header: () => <span>Location</span>,
      },
    ],
    [],
  )

  const onSortHandler = (arg: any) => {
    setSorting(arg())
  }

  const table = useReactTable({
    data: transactions,
    columns,
    rowCount: totalTransactions,
    manualPagination: true,
    state: {
      pagination,
      sorting,
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
                <TableRow key={row.id} onClick={() => onRowClick?.(row.original)}>
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
                No exchange rates found. Add your first exchange rate to get
                started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="h-4" />
      <Pagination table={table} />
    </>
  )
}
