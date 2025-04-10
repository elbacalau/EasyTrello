"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowDown, ArrowUp, Calendar, Filter, Search, SlidersHorizontal, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for tasks across all boards
const allTasks = [
  {
    id: 1,
    title: "Create social media content calendar",
    description: "Plan out posts for the next month across all platforms",
    board: { id: 1, name: "Marketing Campaign", color: "bg-blue-500" },
    status: "To Do",
    dueDate: "2024-06-15",
    priority: "High",
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 2,
    title: "Competitor analysis",
    description: "Research what competitors are doing for their Q2 campaigns",
    board: { id: 1, name: "Marketing Campaign", color: "bg-blue-500" },
    status: "To Do",
    dueDate: "2024-06-10",
    priority: "Medium",
    assignee: {
      id: 3,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 3,
    title: "Design campaign assets",
    description: "Create banners, social media graphics, and email templates",
    board: { id: 1, name: "Marketing Campaign", color: "bg-blue-500" },
    status: "In Progress",
    dueDate: "2024-06-05",
    priority: "High",
    assignee: {
      id: 4,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 4,
    title: "Define campaign goals",
    description: "Set clear objectives and KPIs for the campaign",
    board: { id: 1, name: "Marketing Campaign", color: "bg-blue-500" },
    status: "Completed",
    dueDate: "2024-05-25",
    priority: "High",
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 5,
    title: "Budget approval",
    description: "Get final sign-off on campaign budget from finance",
    board: { id: 1, name: "Marketing Campaign", color: "bg-blue-500" },
    status: "Completed",
    dueDate: "2024-05-20",
    priority: "Medium",
    assignee: {
      id: 5,
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 6,
    title: "Prepare product demo",
    description: "Create a demo for the new product features",
    board: { id: 2, name: "Product Launch", color: "bg-green-500" },
    status: "In Progress",
    dueDate: "2024-06-08",
    priority: "High",
    assignee: {
      id: 2,
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 7,
    title: "Update user documentation",
    description: "Update the user guide with new features",
    board: { id: 2, name: "Product Launch", color: "bg-green-500" },
    status: "To Do",
    dueDate: "2024-06-12",
    priority: "Medium",
    assignee: {
      id: 3,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 8,
    title: "Finalize pricing strategy",
    description: "Determine pricing tiers for the new product",
    board: { id: 2, name: "Product Launch", color: "bg-green-500" },
    status: "Completed",
    dueDate: "2024-05-30",
    priority: "High",
    assignee: {
      id: 5,
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 9,
    title: "Redesign homepage",
    description: "Update the homepage with new branding",
    board: { id: 3, name: "Website Redesign", color: "bg-purple-500" },
    status: "In Progress",
    dueDate: "2024-06-20",
    priority: "High",
    assignee: {
      id: 4,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 10,
    title: "Optimize mobile experience",
    description: "Ensure the website is fully responsive",
    board: { id: 3, name: "Website Redesign", color: "bg-purple-500" },
    status: "To Do",
    dueDate: "2024-06-25",
    priority: "Medium",
    assignee: {
      id: 2,
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
]

export default function BacklogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedPriority, setSelectedPriority] = useState<string[]>([])
  const [selectedAssignee, setSelectedAssignee] = useState<string[]>([])
  const [selectedBoard, setSelectedBoard] = useState<string>("")

  // Get unique values for filters
  const statuses = [...new Set(allTasks.map((task) => task.status))]
  const priorities = [...new Set(allTasks.map((task) => task.priority))]
  const assignees = [...new Set(allTasks.map((task) => task.assignee.name))]
  const boards = [...new Set(allTasks.map((task) => task.board.name))]

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    return allTasks
      .filter((task) => {
        // Search filter
        const matchesSearch =
          searchQuery === "" ||
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())

        // Status filter
        const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(task.status)

        // Priority filter
        const matchesPriority = selectedPriority.length === 0 || selectedPriority.includes(task.priority)

        // Assignee filter
        const matchesAssignee = selectedAssignee.length === 0 || selectedAssignee.includes(task.assignee.name)

        // Board filter
        const matchesBoard = selectedBoard === "" || task.board.name === selectedBoard

        return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesBoard
      })
      .sort((a, b) => {
        // Sort by selected column
        if (sortColumn === "title") {
          return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        } else if (sortColumn === "board") {
          return sortDirection === "asc"
            ? a.board.name.localeCompare(b.board.name)
            : b.board.name.localeCompare(a.board.name)
        } else if (sortColumn === "status") {
          return sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
        } else if (sortColumn === "priority") {
          const priorityOrder = { High: 3, Medium: 2, Low: 1 }
          return sortDirection === "asc"
            ? priorityOrder[a.priority as keyof typeof priorityOrder] -
                priorityOrder[b.priority as keyof typeof priorityOrder]
            : priorityOrder[b.priority as keyof typeof priorityOrder] -
                priorityOrder[a.priority as keyof typeof priorityOrder]
        } else if (sortColumn === "dueDate") {
          return sortDirection === "asc"
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        } else if (sortColumn === "assignee") {
          return sortDirection === "asc"
            ? a.assignee.name.localeCompare(b.assignee.name)
            : b.assignee.name.localeCompare(a.assignee.name)
        }
        return 0
      })
  }, [searchQuery, sortColumn, sortDirection, selectedStatus, selectedPriority, selectedAssignee, selectedBoard])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-slate-500"
      case "In Progress":
        return "bg-amber-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-slate-500"
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Backlog</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={selectedBoard} onValueChange={setSelectedBoard}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Boards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boards</SelectItem>
                {boards.map((board) => (
                  <SelectItem key={board} value={board}>
                    {board}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={selectedStatus.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedStatus([...selectedStatus, status])
                      } else {
                        setSelectedStatus(selectedStatus.filter((s) => s !== status))
                      }
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Priority
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {priorities.map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={selectedPriority.includes(priority)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPriority([...selectedPriority, priority])
                      } else {
                        setSelectedPriority(selectedPriority.filter((p) => p !== priority))
                      }
                    }}
                  >
                    {priority}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <User className="h-4 w-4 mr-2" />
                  Assignee
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {assignees.map((assignee) => (
                  <DropdownMenuCheckboxItem
                    key={assignee}
                    checked={selectedAssignee.includes(assignee)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAssignee([...selectedAssignee, assignee])
                      } else {
                        setSelectedAssignee(selectedAssignee.filter((a) => a !== assignee))
                      }
                    }}
                  >
                    {assignee}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? "task" : "tasks"}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                  <div className="flex items-center">
                    Task
                    {sortColumn === "title" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("board")}>
                  <div className="flex items-center">
                    Board
                    {sortColumn === "board" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center">
                    Status
                    {sortColumn === "status" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("priority")}>
                  <div className="flex items-center">
                    Priority
                    {sortColumn === "priority" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("dueDate")}>
                  <div className="flex items-center">
                    Due Date
                    {sortColumn === "dueDate" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("assignee")}>
                  <div className="flex items-center">
                    Assignee
                    {sortColumn === "assignee" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/boards/${task.board.id}?task=${task.id}`}
                      className="font-medium hover:underline"
                    >
                      {task.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${task.board.color}`}></div>
                      <span>{task.board.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(task.status)} text-white`}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {formatDate(task.dueDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{task.assignee.name}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p>No tasks found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
