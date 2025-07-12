import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}
