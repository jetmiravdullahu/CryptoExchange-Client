import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from './ui/button'
import { SelectInput } from './ui/select'
import { Input } from './ui/input'
import type { Table } from '@tanstack/react-table'

export const Pagination = <T,>({ table }: { table: Table<T> }) => {
  const [goToPageInput, setGoToPageInput] = useState<number>(1)

  const handleGoToPage = () => {
    const page = goToPageInput ? Number(goToPageInput) : 0
    table.setPageIndex(page)
  }
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="flex flex-col justify-center items-center sm:flex-row gap-4 w-full">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Rows per page:
          </span>
          <SelectInput
            label="Sizes"
            options={[
              {
                label: '10',
                value: '10',
              },
              {
                label: '15',
                value: '15',
              },
              {
                label: '20',
                value: '20',
              },
              {
                label: '30',
                value: '30',
              },
              {
                label: '40',
                value: '40',
              },
              {
                label: '50',
                value: '50',
              },
            ]}
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          />
        </div>

        <div className="flex ml-auto items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground whitespace-nowrap px-2">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Go to page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Go to:
          </span>
          <Input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              setGoToPageInput(page)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
            className="w-16 h-8"
            placeholder="1"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-transparent"
            onClick={handleGoToPage}
          >
            Go
          </Button>
        </div>
      </div>
    </div>
  )
}
