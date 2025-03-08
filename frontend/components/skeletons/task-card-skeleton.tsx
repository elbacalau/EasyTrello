import { Skeleton } from "@/components/ui/skeleton"

export function TaskCardSkeleton() {
  return (
    <div className="rounded-md border bg-card shadow-sm p-3 space-y-3">
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

