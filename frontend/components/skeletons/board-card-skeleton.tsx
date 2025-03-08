import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BoardCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="h-2 w-full bg-muted" />
      <CardContent className="p-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      </CardFooter>
    </Card>
  )
}

