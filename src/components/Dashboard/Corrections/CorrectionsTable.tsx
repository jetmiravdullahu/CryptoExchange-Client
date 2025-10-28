import { ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'

import type { Correction } from '@/types/correction'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Pagination } from '@/components/Pagination'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function CorrectionsTable({
  corrections,
  totalCorrections,
  pagination,
  setPagination,
  sorting,
  setSorting,
}: {
  corrections: Array<Correction>
  totalCorrections: number
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}) {
  const columns = useMemo<Array<ColumnDef<Correction, any>>>(
    () => [
      {
        accessorKey: 'correction_ref',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        header: () => <span>Correction Reference</span>,
      },
      {
        accessorKey: 'amount',
        cell: (info) => info.getValue(),
        header: () => <span>Amount</span>,
      },
      {
        accessorKey: 'correction_type',
        cell: (info) => (
          <Badge variant="outline" className="capitalize">
            {info.getValue()}
          </Badge>
        ),
        header: () => <span>Correction Type</span>,
      },
      {
        accessorKey: 'reason',
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
        header: () => <span>Reason</span>,
      },
      {
        accessorKey: 'approved_by',
        cell: ({ getValue, row }) => {
          return (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="max-w-[200px] cursor-help">
                    <div className="text-sm text-muted-foreground truncate">
                      {getValue().name}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[300px] h-min wrap-break-word"
                >
                  <p>
                    Approved by {getValue().name} on{' '}
                    {dayjs(row.original.approved_at).format('MMMM D, YYYY')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
        header: () => <span>Related Entity Type</span>,
      },
    ],
    [],
  )

  const onSortHandler = (arg: any) => {
    setSorting(arg())
  }

  const table = useReactTable({
    data: corrections,
    columns,
    rowCount: totalCorrections,
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
                No corrections found. Add your first correction to get started.
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
