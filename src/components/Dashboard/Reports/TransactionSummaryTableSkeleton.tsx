import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TransactionSummaryTableSkeletonProps {
  rows?: number
}

export function TransactionSummaryTableSkeleton({
  rows = 5,
}: TransactionSummaryTableSkeletonProps) {
  return (
    <div className="rounded-md border px-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Sold (FIAT → CRYPTO)</TableHead>
            <TableHead className="text-right">Bought (CRYPTO → FIAT)</TableHead>
            <TableHead className="text-right">Total Fees</TableHead>
            <TableHead className="text-right">Transactions</TableHead>
            <TableHead className="text-right">Net Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index}>
              {/* Location */}
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              {/* Status badge */}
              <TableCell>
                <Skeleton className="h-5 w-14 rounded-full" />
              </TableCell>
              {/* Sold */}
              <TableCell>
                <div className="flex flex-col items-end gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </TableCell>
              {/* Bought */}
              <TableCell>
                <div className="flex flex-col items-end gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </TableCell>
              {/* Total Fees */}
              <TableCell>
                <div className="flex flex-col items-end gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </TableCell>
              {/* Transactions */}
              <TableCell>
                <div className="flex justify-end">
                  <Skeleton className="h-4 w-8" />
                </div>
              </TableCell>
              {/* Net Balance */}
              <TableCell>
                <div className="flex justify-end">
                  <Skeleton className="h-4 w-16" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
