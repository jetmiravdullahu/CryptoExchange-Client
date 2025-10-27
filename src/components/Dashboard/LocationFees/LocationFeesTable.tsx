import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'

import type { LocationFeesTableData } from '@/types/locationFee'

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
import { useDeleteLocationFeeMutation } from '@/hooks/api/LocationFee/useDeleteLocationFee'

export function LocationFeesTable({
  locationFees,
  totalLocationFees,
  pagination,
  setPagination,
  sorting,
  setSorting,
}: {
  locationFees: Array<LocationFeesTableData>
  totalLocationFees: number
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}) {
  const queryClient = useQueryClient()

  const { mutate: deleteLocationFee } = useDeleteLocationFeeMutation()

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this location Fee?')) {
      deleteLocationFee(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getLocationFees'] })
          },
        },
      )
    }
  }
  const columns = useMemo<Array<ColumnDef<LocationFeesTableData, any>>>(
    () => [
      {
        accessorKey: 'fee_type',
        cell: (info) => info.getValue(),
        header: () => <span>Fee Type</span>,
      },
      {
        accessorKey: 'fee_value',
        cell: (info) => Number(info.getValue()).toFixed(2),
        header: () => <span>Fee Value</span>,
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
    data: locationFees,
    columns,
    rowCount: totalLocationFees,
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
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
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
                No location fees found. Add your first location to get started.
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
