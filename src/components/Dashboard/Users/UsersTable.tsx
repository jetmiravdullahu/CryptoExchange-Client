import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
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

import type { UserFormData, UserRole, UserTableData } from '@/types/user'

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

import { Pagination } from '@/components/Pagination'
import { useDeleteUserMutation } from '@/hooks/api/User/useDeleteUser'

export function UsersTable({
  users,
  setActionUser,
  totalUsers,
  pagination,
  setPagination,
  sorting,
  setSorting,
}: {
  users: Array<UserTableData>
  setActionUser: (user: UserFormData | null) => void
  totalUsers: number
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}) {
  const queryClient = useQueryClient()

  const { mutate: deleteUser } = useDeleteUserMutation() 

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'default'
      case 'ADMIN':
        return 'secondary'
      case 'SELLER':
        return 'outline'
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getUsers'] })
          },
        },
      )
    }
  }
  const openEditDialog = (user: UserFormData) => {
    setActionUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      password: '',
      password_confirmation: '',
    })
  }

  const columns = useMemo<Array<ColumnDef<UserTableData, any>>>(
    () => [
      {
        accessorKey: 'name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        header: () => <span>Name</span>,
      },
      {
        accessorKey: 'email',
        cell: (info) => info.getValue(),
        header: () => <span>Email</span>,
      },
      {
        accessorKey: 'role',
        cell: (info) => (
          <Badge
            variant={getRoleBadgeVariant(info.getValue())}
            className="capitalize"
          >
            {info.getValue()}
          </Badge>
        ),
        header: () => <span>Role</span>,
      },
      {
        accessorKey: 'location',
        cell: (info) => {
          return (
            info.getValue()?.name ?
            
            <span className="font-medium">{info.getValue().name}</span> :
            (
              <span className="text-muted-foreground/50">—</span>
            )
          )
        },
        header: () => <span>Location</span>,
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
              className="h-8 w-8"
              onClick={() =>
                openEditDialog({
                  ...row.original,
                  password: '',
                  password_confirmation: '',
                })
              }
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
    data: users,
    columns,
    rowCount: totalUsers,
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
                No users found. Add your first user to get started.
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
