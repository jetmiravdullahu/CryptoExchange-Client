import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { TransfersTable } from './Dashboard/Transfers/TransfersTable'
import { TransferFormModal } from './Dashboard/Transfers/TransferFormModal'
import { TransferDetailModal } from './TransferDetailModal'
import TableFilters from './TableFilters'
import type { ITransfer, TransferFormData } from '@/types/transfer'
import { useGetTransfers } from '@/hooks/api/Transfer/useGetTransfers'
import { useGetCurrentUser } from '@/hooks/api/Auth/useGetCurrentUser'

export const TransfersSection = () => {
  const { data: user } = useGetCurrentUser()
  const [transferFormData, setTransferFormData] =
    useState<TransferFormData | null>(null)
  const [transferDetails, setTransferDetails] = useState<ITransfer | null>(null)

  const {
    data: transfers,
    pagination,
    setPagination,
    sorting,
    setSorting,
    filters,
    onSetFilters,
  } = useGetTransfers()

  const onCreateTransfer = () => {
    setTransferFormData({
      transfer_type: 'LOCATION_TO_LOCATION',
      to_location_id: '',
      from_location_id: user.user.location_id || '',
      asset_id: '',
      amount: '0',
      notes: '',
    })
  }

  const onViewTransfer = (transfer: ITransfer) => {
    setTransferDetails(transfer)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Transfers Management
        </h2>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage transfer requests
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="max-w-full overflow-hidden">
            <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full">
                <CardTitle>
                  <span>All Transfers</span>
                </CardTitle>
                <CardDescription className="mb-4">
                  Manage transfer requests and statuses
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={onCreateTransfer}>
                <Plus className="h-4 w-4" />
                Create Transfer
              </Button>
            </div>
            <TableFilters
              options={filters}
              onSetFilters={onSetFilters}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <TransfersTable
              transfers={transfers.data}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              totalTransfers={transfers.total}
              setSorting={setSorting}
              onViewTransfer={onViewTransfer}
            />
          </div>
        </CardContent>
      </Card>
      {transferFormData && (
        <TransferFormModal
          isOpen={!!transferFormData}
          onClose={() => setTransferFormData(null)}
          transfer={transferFormData}
        />
      )}

      <TransferDetailModal
        open={!!transferDetails}
        onOpenChange={() => setTransferDetails(null)}
        transfer={transferDetails}
      />
    </div>
  )
}
