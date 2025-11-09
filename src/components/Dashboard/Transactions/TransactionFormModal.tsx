import { Suspense } from 'react'
import { TransactionFormContent } from './TransactionFormContent'
import { TransactionFormSkeleton } from './TransactionFormSkeleton'
import { Dialog, DialogContent } from '@/components/ui/dialog'

type TransactionFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionFormDialog({
  open,
  onOpenChange,
}: TransactionFormDialogProps) {
  return (
    <Dialog modal open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <Suspense fallback={<TransactionFormSkeleton />}>
          <TransactionFormContent onOpenChange={onOpenChange} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}
