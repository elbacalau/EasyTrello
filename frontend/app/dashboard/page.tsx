import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Trello } from "lucide-react"

export default function DashboardPage() {
  // Sample data for boards
  const recentBoards = [
    { id: 1, name: "Marketing Campaign", tasks: 12, completed: 5 },
    { id: 2, name: "Product Launch", tasks: 8, completed: 3 },
    { id: 3, name: "Website Redesign", tasks: 15, completed: 10 },
  ]

  // Sample data for tasks
  const upcomingTasks = [
    { id: 1, name: "Create social media posts", dueDate: "Tomorrow", priority: "High" },
    { id: 2, name: "Review design mockups", dueDate: "Today", priority: "Medium" },
    { id: 3, name: "Update documentation", dueDate: "In 3 days", priority: "Low" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/boards/new">
            <Plus className="mr-2 h-4 w-4" />
            New Board
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Boards</CardTitle>
            <Trello className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+8 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">-2 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Boards</CardTitle>
            <CardDescription>Your recently accessed boards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBoards.map((board) => (
                <div key={board.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Link href={`/dashboard/boards/${board.id}`} className="font-medium hover:underline">
                      {board.name}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {board.completed} of {board.tasks} tasks completed
                    </div>
                  </div>
                  <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(board.completed / board.tasks) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/boards">View All Boards</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{task.name}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      Due {task.dueDate}
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === "High"
                        ? "bg-destructive/10 text-destructive"
                        : task.priority === "Medium"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/backlog">View All Tasks</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
