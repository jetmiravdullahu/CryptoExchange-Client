import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import type { ExchangeRatesTableData } from '@/types/exchangeRate'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Pagination } from '@/components/Pagination'
import { useDeleteExchangeRateMutation } from '@/hooks/api/ExchangeRate/useDeleteExchangeRate'

export function ExchangeRatesTable({
  exchangeRates,
  totalExchangeRates,
  pagination,
  setPagination,
  sorting,
  setSorting,
}: {
  exchangeRates: Array<ExchangeRatesTableData>
  totalExchangeRates: number
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}) {
  const queryClient = useQueryClient()

  const { mutate: deleteExchangeRate } = useDeleteExchangeRateMutation()

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exchange rate?')) {
      deleteExchangeRate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getExchangeRates'] })
          },
        },
      )
    }
  }

  const columns = useMemo<Array<ColumnDef<ExchangeRatesTableData, any>>>(
    () => [
      {
        accessorKey: 'from_asset',
        cell: (info) => (
          <span className="font-medium">{info.getValue().name}</span>
        ),
        header: () => <span>From Asset</span>,
      },
      {
        accessorKey: 'to_asset',
        cell: (info) => info.getValue().name,
        header: () => <span>To Asset</span>,
      },
      {
        accessorKey: 'rate',
        cell: (info) => Number(info.getValue()).toFixed(2),
        header: () => <span>Rate</span>,
      },
      {
        accessorKey: 'effective_from',
        cell: (info) => dayjs(info.getValue()).format('DD/MM/YYYY'),
        header: () => <span>Effective From</span>,
      },
      {
        accessorKey: 'effective_to',
        cell: (info) =>
          info.getValue() ? dayjs(info.getValue()).format('DD/MM/YYYY') : '...',
        header: () => <span>Effective To</span>,
      },
      {
        accessorKey: 'is_active',
        cell: (info) => (info.getValue() ? 'Active' : 'Inactive'),
        header: () => <span>Is Active</span>,
      },
      {
        accessorKey: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
      },
    ],
    [],
  )

  const onSortHandler = (arg: any) => {
    setSorting(arg())
  }

  const table = useReactTable({
    data: exchangeRates,
    columns,
    rowCount: totalExchangeRates,
    manualPagination: true,
    state: {
      // columnFilters,
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
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  // className="px-4 py-3 text-left"
                >
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
