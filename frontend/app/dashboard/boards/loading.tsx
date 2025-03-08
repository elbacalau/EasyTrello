import { BoardCardSkeleton } from "@/components/skeletons/board-card-skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Boards</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <div className="pl-8 w-full sm:w-[300px] h-10 rounded-md border border-input bg-background" />
          </div>
          <div className="h-10 px-4 rounded-md bg-primary text-primary-foreground flex items-center">
            <span className="mr-2 h-4 w-4" />
            New Board
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <BoardCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

