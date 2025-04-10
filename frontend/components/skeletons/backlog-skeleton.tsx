import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

export function BacklogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Skeleton className="h-10 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[300px]" />
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-9 w-[180px]" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">
                  <Checkbox disabled />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full max-w-[250px]" />
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-2 w-2 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
