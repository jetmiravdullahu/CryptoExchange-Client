import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'

import type { LocationFormData, LocationTableData } from '@/types/location'

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
import { useDeleteLocationMutation } from '@/hooks/api/Location/useDeleteLocation'
import { useGetCurrentUser } from '@/hooks/api/Auth/useGetCurrentUser'

export function LocationsTable({
  locations,
  setActionLocation,
  totalLocations,
  pagination,
  setPagination,
  sorting,
  setSorting,
}: {
  locations: Array<LocationTableData>
  setActionLocation: (user: LocationFormData | null) => void
  totalLocations: number
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: deleteLocation } = useDeleteLocationMutation()

  const { data: currentUser } = useGetCurrentUser()

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      deleteLocation(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getLocations'] })
          },
        },
      )
    }
  }
  const openEditDialog = (location: LocationTableData) => {
    setActionLocation(location)
  }

  const columns = useMemo<Array<ColumnDef<LocationTableData, any>>>(
    () => [
      {
        accessorKey: 'name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        header: () => <span>Name</span>,
      },
      {
        accessorKey: 'code',
        cell: (info) => info.getValue(),
        header: () => <span>Code</span>,
      },
      {
        accessorKey: 'address',
        cell: (info) => info.getValue(),
        header: () => <span>Address</span>,
      },
      {
        accessorKey: 'city',
        cell: (info) => info.getValue(),
        header: () => <span>City</span>,
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
            {currentUser.user.role === 'SUPER_ADMIN' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="View details"
                aria-label="View details"
                onClick={() =>
                  navigate({
                    to: '/dashboard/locations/$location_id/fees',
                    params: {
                      location_id: row.original.id,
                    },
                  })
                }
              >
                <ClipboardList className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEditDialog(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
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
    data: locations,
    columns,
    rowCount: totalLocations,
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
                No locations found. Add your first location to get started.
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
