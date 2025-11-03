import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'

import type { IAccountLedger, ReferenceType } from '@/types/accountLedger'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/Pagination'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Props = {
  accountLedgers: Array<IAccountLedger>
  totalAccountLedgers: number
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}

export function AccountLedgersTable({
  accountLedgers,
  totalAccountLedgers,
  pagination,
  setPagination,
  sorting,
  setSorting,
}: Props) {
  const onSortHandler = (arg: any) => {
    setSorting((prev) => {
      const next = arg(prev)
      return next
    })
  }

  function getRefTypeBadgeVariant(type: ReferenceType) {
    switch (type) {
      case 'TRANSACTION':
        return 'default'
      case 'TRANSFER':
        return 'secondary'
      case 'CORRECTION':
        return 'outline'
      case 'MANUAL_ADJUSTMENT':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const columns = useMemo<Array<ColumnDef<IAccountLedger, any>>>(
    () => [
      {
        accessorKey: 'entry_number',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        header: () => <span>Entry Number</span>,
      },
      {
        accessorKey: 'entry_date',
        cell: (info) => dayjs(info.getValue()).format('DD/MM/YYYY'),
        header: () => <span>Entry Date</span>,
        enableSorting: false,
      },
      {
        accessorKey: 'reference_type',
        header: 'Type',
        cell: ({ getValue }) => {
          return (
            <Badge variant={getRefTypeBadgeVariant(getValue())}>
              {getValue()}
            </Badge>
          )
        },
        enableSorting: false,
      },
      {
        accessorKey: 'is_active',
        cell: (info) => (info.getValue() ? 'Active' : 'Inactive'),
        header: () => <span>Is Active</span>,
        enableSorting: false,
      },
      {
        accessorKey: 'description',
        enableSorting: false,
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
        accessorKey: 'debit_amount',
        enableSorting: false,
        header: () => <div className="text-right">Debit</div>,
        cell: ({ getValue }) => {
          const amount = Number.parseFloat(getValue())
          return (
            <div className="text-right font-mono text-sm">
              {amount > 0 ? (
                <span className="text-red-500">-{amount.toFixed(2)}</span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'credit_amount',
        enableSorting: false,
        header: () => <div className="text-right">Credit</div>,
        cell: ({ getValue }) => {
          const amount = Number.parseFloat(getValue())
          return (
            <div className="text-right font-mono text-sm">
              {amount > 0 ? (
                <span className="text-green-500">+{amount.toFixed(2)}</span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'balance_before',
        enableSorting: false,
        header: () => <div className="text-right">Balance</div>,
        cell: ({ getValue }) => {
          const balance = Number.parseFloat(getValue())
          return (
            <div className="text-right font-mono text-sm font-medium">
              {balance.toFixed(2)}
            </div>
          )
        },
      },
      {
        accessorKey: 'balance_after',
        enableSorting: false,
        header: () => <div className="text-right">Balance</div>,
        cell: ({ getValue }) => {
          const balance = Number.parseFloat(getValue())
          return (
            <div className="text-right font-mono text-sm font-medium">
              {balance.toFixed(2)}
            </div>
          )
        },
      },
      {
        accessorKey: 'created_by',
        enableSorting: false,
        cell: (info) => info.getValue().name,
        header: () => <span>Created By</span>,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: accountLedgers,
    columns,
    rowCount: totalAccountLedgers,
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
                <TableRow key={row.id}>
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
                No assets found. Add your first asset to get started.
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
