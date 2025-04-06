"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MoreHorizontal, Calendar, User, Tag } from "lucide-react"
import { fetchBoardColumns } from "@/lib/api/board"
import { userAgent } from "next/server"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { ApiResponseTypes } from "@/types/apiResponse"

// Sample data for the board
const boardData = {
  id: 1,
  name: "Marketing Campaign",
  description: "Q2 marketing campaign planning and execution",
  color: "bg-blue-500",
}

// Sample data for columns
const initialColumns = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: 1,
        title: "Create social media content calendar",
        description: "Plan out posts for the next month across all platforms",
        dueDate: "2024-06-15",
        priority: "High",
        assignee: {
          id: 1,
          name: "John Doe",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        comments: [
          {
            id: 1,
            user: {
              id: 2,
              name: "Jane Smith",
              avatar: "/placeholder.svg?height=32&width=32",
            },
            text: "Let's focus on Instagram and Twitter first",
            timestamp: "2024-05-28T10:30:00Z",
          },
        ],
      },
      {
        id: 2,
        title: "Competitor analysis",
        description: "Research what competitors are doing for their Q2 campaigns",
        dueDate: "2024-06-10",
        priority: "Medium",
        assignee: {
          id: 3,
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        comments: [],
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    tasks: [
      {
        id: 3,
        title: "Design campaign assets",
        description: "Create banners, social media graphics, and email templates",
        dueDate: "2024-06-05",
        priority: "High",
        assignee: {
          id: 4,
          name: "Sarah Williams",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        comments: [
          {
            id: 2,
            user: {
              id: 1,
              name: "John Doe",
              avatar: "/placeholder.svg?height=32&width=32",
            },
            text: "The first drafts look great!",
            timestamp: "2024-05-29T14:15:00Z",
          },
        ],
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    tasks: [
      {
        id: 4,
        title: "Define campaign goals",
        description: "Set clear objectives and KPIs for the campaign",
        dueDate: "2024-05-25",
        priority: "High",
        assignee: {
          id: 1,
          name: "John Doe",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        comments: [],
      },
      {
        id: 5,
        title: "Budget approval",
        description: "Get final sign-off on campaign budget from finance",
        dueDate: "2024-05-20",
        priority: "Medium",
        assignee: {
          id: 5,
          name: "Michael Brown",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        comments: [],
      },
    ],
  },
]

// Sample team members for assignment
const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function BoardPage() {
  const params: Params = useParams()
  const [columns, setColumns] = useState(initialColumns)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignee: null,
  })
  const [newComment, setNewComment] = useState("")
  const [draggedTask, setDraggedTask] = useState(null)
  const [draggedColumn, setDraggedColumn] = useState(null)


  useEffect(() => {
    const loadColumns = async () => {
      const { result, detail } = await fetchBoardColumns(parseInt(params.id))
      if (result === ApiResponseTypes[ApiResponseTypes.success]) {
        console.log({ detail });
        setColumns(detail)
      }
    }
    loadColumns();
  }, [params.id])
  



  const handleDragStart = (task, columnId) => {
    setDraggedTask(task)
    setDraggedColumn(columnId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (columnId) => {
    if (draggedTask && draggedColumn !== columnId) {
      // Remove from original column
      const updatedColumns = columns.map((col) => {
        if (col.id === draggedColumn) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.id !== draggedTask.id),
          }
        }
        return col
      })

      // Add to new column
      const finalColumns = updatedColumns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, draggedTask],
          }
        }
        return col
      })

      setColumns(finalColumns)
    }
    setDraggedTask(null)
    setDraggedColumn(null)
  }

  const handleAddTask = (columnId) => {
    if (newTask.title.trim() === "") return

    const task = {
      id: Math.floor(Math.random() * 1000),
      ...newTask,
      comments: [],
    }

    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...col.tasks, task],
        }
      }
      return col
    })

    setColumns(updatedColumns)
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      assignee: null,
    })
    setIsNewTaskDialogOpen(false)
  }

  const handleAddComment = () => {
    if (newComment.trim() === "" || !selectedTask) return

    const comment = {
      id: Math.floor(Math.random() * 1000),
      user: teamMembers[0], // Current user (hardcoded for demo)
      text: newComment,
      timestamp: new Date().toISOString(),
    }

    const updatedColumns = columns.map((col) => {
      return {
        ...col,
        tasks: col.tasks.map((task) => {
          if (task.id === selectedTask.id) {
            return {
              ...task,
              comments: [...task.comments, comment],
            }
          }
          return task
        }),
      }
    })

    setColumns(updatedColumns)
    setNewComment("")

    const updatedTask = updatedColumns.flatMap((col) => col.tasks).find((task) => task.id === selectedTask.id)

    setSelectedTask(updatedTask)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive"
      case "Medium":
        return "bg-amber-500/10 text-amber-500"
      case "Low":
        return "bg-green-500/10 text-green-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatCommentTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{boardData.name}</h1>
          <p className="text-muted-foreground">{boardData.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            Invite
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Board</DropdownMenuItem>
              <DropdownMenuItem>Board Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete Board</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <Card>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {column.title} ({column.tasks.length})
                  </CardTitle>
                  <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add task</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>Create a new task for the {column.title} column.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Task Title</Label>
                          <Input
                            id="title"
                            placeholder="Enter task title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Enter task description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newTask.priority}
                            onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                          >
                            <SelectTrigger id="priority">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="assignee">Assignee</Label>
                          <Select
                            onValueChange={(value) => {
                              const assignee = teamMembers.find((member) => member.id.toString() === value)
                              setNewTask({ ...newTask, assignee })
                            }}
                          >
                            <SelectTrigger id="assignee">
                              <SelectValue placeholder="Assign to..." />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id.toString()}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleAddTask(column.id)}>Add Task</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task, column.id)}
                      className="rounded-md border bg-card shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing"
                    >
                      <div
                        className="p-3 space-y-3"
                        onClick={() => {
                          setSelectedTask(task)
                          setIsTaskDialogOpen(true)
                        }}
                      >
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-muted-foreground line-clamp-2">{task.description}</div>
                        )}
                        <div className="flex items-center justify-between">
                          {task.dueDate && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(task.dueDate)}
                            </div>
                          )}
                          <div className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </div>
                        </div>
                        {task.assignee && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                            </div>
                            {task.comments.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {task.comments.length} comment{task.comments.length !== 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <DialogDescription>{selectedTask.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Due Date</Label>
                    <div className="flex items-center mt-1">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {formatDate(selectedTask.dueDate) || "No due date"}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Priority</Label>
                    <div
                      className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {selectedTask.priority}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Assignee</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedTask.assignee ? (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedTask.assignee.avatar} alt={selectedTask.assignee.name} />
                          <AvatarFallback>{selectedTask.assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{selectedTask.assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Comments</Label>
                    <span className="text-xs text-muted-foreground">
                      {selectedTask.comments.length} comment{selectedTask.comments.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-4 max-h-[200px] overflow-y-auto">
                    {selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatCommentTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleAddComment()
                        }
                      }}
                    />
                    <Button onClick={handleAddComment}>Post</Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                  Close
                </Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

