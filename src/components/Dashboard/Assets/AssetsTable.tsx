import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'

import type { AssetFormData, AssetTableData } from '@/types/asset'
import { useDeleteAssetMutation } from '@/hooks/api/Asset/useDeleteAssetMutation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { useGetCurrentUser } from '@/hooks/api/Auth/useGetCurrentUser'

type Props = {
  assets: Array<AssetFormData>
  setActionAsset: (asset: AssetFormData | null) => void
  totalAssets: number
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}

export function AssetsTable({
  assets,
  setActionAsset,
  totalAssets,
  pagination,
  setPagination,
  sorting,
  setSorting,
}: Props) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: deleteAsset } = useDeleteAssetMutation()

  const { data: currentUser } = useGetCurrentUser()

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      deleteAsset(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getAssets'] })
          },
        },
      )
    }
  }
  const onSortHandler = (arg: any) => {
    setSorting(arg())
  }

  const columns = useMemo<Array<ColumnDef<AssetTableData, any>>>(
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
        accessorKey: 'asset_class',
        cell: (info) => info.getValue(),
        header: () => <span>Asset Class</span>,
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
                    to: '/dashboard/assets/$asset_id/exchange-rates',
                    params: {
                      asset_id: row.original.id,
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
              onClick={() => setActionAsset(row.original)}
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

  const table = useReactTable({
    data: assets,
    columns,
    rowCount: totalAssets,
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
