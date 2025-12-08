import { ArrowUpDown } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import type { IReport } from '@/types/report'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function TransactionSummaryTable({
  reports,
  // totalReports,
  // sorting,
  // setSorting,
}: {
  reports: Array<IReport['location_summaries'][number]>
  // totalReports: number
  // sorting: SortingState
  // setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}) {
  const columns: Array<ColumnDef<IReport['location_summaries'][number]>> = [
    {
      accessorKey: 'location_name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('location_name')}</span>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active')
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'sold.total_amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full justify-end"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Sold (FIAT → CRYPTO)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const sold = row.original.sold
        return (
          <div className="text-right">
            <div>{formatCurrency(sold.total_amount)}</div>
            <div className="text-xs text-muted-foreground">
              {sold.total_transaction_count} txns
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'bought.total_amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full justify-end"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Bought (CRYPTO → FIAT)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const bought = row.original.bought
        return (
          <div className="text-right">
            <div>{formatCurrency(bought.total_amount)}</div>
            <div className="text-xs text-muted-foreground">
              {bought.total_transaction_count} txns
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'fees.total_fees_collected',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full justify-end"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Fees
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const fees = row.original.fees
        return (
          <div className="text-right">
            <div>{formatCurrency(fees.total_fees_collected)}</div>
            <div className="text-xs text-muted-foreground">
              ~{formatCurrency(fees.average_fee_per_transaction)}/txn
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'fees.total_transactions',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full justify-end"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Transactions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right">{row.original.fees.total_transactions}</div>
      ),
    },
    {
      accessorKey: 'net_balance.amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full justify-end"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Net Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = row.original.net_balance.amount
        return (
          <div className="text-right">
            <span className={amount >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(amount)}
            </span>
          </div>
        )
      },
    },
  ]

  // const onSortHandler = (arg: any) => {
  //   setSorting(arg())
  // }

  const table = useReactTable({
    data: reports,
    columns,
    // rowCount: totalReports,
    manualPagination: true,
    // state: {
    //   sorting,
    // },
    // onSortingChange: onSortHandler,
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
                        {/* {header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="inline-block h-4 w-4 ml-2" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="inline-block h-4 w-4 ml-2" />
                        ) : null} */}
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
                      <TableCell
                        className={
                          !cell.row.original.is_active
                            ? 'bg-muted/50'
                            : undefined
                        }
                        key={cell.id}
                      >
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
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
