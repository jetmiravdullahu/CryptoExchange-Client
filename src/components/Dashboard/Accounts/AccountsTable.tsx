import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChevronDown,
  ChevronUp,
  EyeIcon,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import type { Account, AccountTransactionInput } from '@/types/account'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export const AccountsTable = ({
  accounts,
  openTransactionDataModal,
}: {
  accounts: Array<Account>
  openTransactionDataModal: (
    data: Pick<
      AccountTransactionInput,
      'type' | 'account_id' | 'current_balance'
    >,
  ) => void
}) => {

  const navigate = useNavigate()

  const columns = useMemo<Array<ColumnDef<Account, any>>>(
    () => [
      {
        accessorKey: 'owner_type',
        cell: (info) => info.getValue(),
        header: () => <span>Owner Type</span>,
      },
      {
        accessorKey: 'location',
        cell: (info) => (info.getValue()?.name ? info.getValue().name : 'N/A'),
        header: () => <span>Location</span>,
      },
      {
        accessorKey: 'asset',
        cell: (info) => {
          return <span className="font-medium">{info.getValue().name}</span>
        },
        header: () => <span>Asset</span>,
      },

      {
        accessorKey: 'balance',
        cell: (info) => parseFloat(info.getValue()),
        header: () => <span>Balance</span>,
      },
      {
        accessorKey: 'reserved_balance',
        cell: (info) => parseFloat(info.getValue()),
        header: () => <span>Reserved Balance</span>,
      },
      {
        accessorKey: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                openTransactionDataModal({
                  type: 'deposit',
                  account_id: row.original.id,
                  current_balance: row.original.balance,
                })
              }
            >
              <BanknoteArrowUp className="w-6! h-6!" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                openTransactionDataModal({
                  type: 'withdraw',
                  account_id: row.original.id,
                  current_balance: row.original.balance,
                })
              }
            >
              <BanknoteArrowDown className="w-6! h-6!" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate({
                  to: `/dashboard/accounts/${row.original.id}/ledger`,
                })
              }
            >
              <EyeIcon />
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
    data: accounts,
    columns,
    rowCount: accounts.length,
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
                No accounts found. Add your first account to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
