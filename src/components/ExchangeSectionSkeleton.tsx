import { Skeleton } from "@/components/ui/skeleton"

export function ExchangeSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Convert Currency Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-6">
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>

        {/* From Section */}
        <div className="space-y-4 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* To Section */}
        <div className="space-y-4 mb-6">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" />
        </div>

        {/* Review Trade Button */}
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Location Fee Configuration Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-6">
          <Skeleton className="h-7 w-56 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Location Fee Type */}
        <div className="space-y-4 mb-6">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Location Fee Percentage */}
        <div className="space-y-4 mb-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>

        {/* Help Text */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>
    </div>
  )
}