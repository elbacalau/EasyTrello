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
import { fetchAssignedUsersBoard, fetchBoardColumns } from "@/lib/api/board"
import { userAgent } from "next/server"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { ApiResponse, ApiResponseTypes } from "@/types/apiResponse"
import { AssignedUser, Board } from "@/types/userData"
import { Comment, Task } from "@/types/tasks"
import { BoardColumn } from "@/types/boardColumn"

// Sample data for the board
const boardData = {
  id: 1,
  name: "Marketing Campaign",
  description: "Q2 marketing campaign planning and execution",
  color: "bg-blue-500",
}


export default function BoardPage() {
  const params: Params = useParams()
  const [columns, setColumns] = useState<BoardColumn[]>([])
  const [teamMembers, setTeamMembers] = useState<AssignedUser[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignee: undefined,
  })
  const [newComment, setNewComment] = useState("")
  const [draggedTask, setDraggedTask] = useState<Task>()
  const [draggedColumn, setDraggedColumn] = useState(null)


  useEffect(() => {
    const loadColumns = async () => {
      await fetchBoardColumns(parseInt(params.id))
        .then(({ result, detail }: ApiResponse<BoardColumn[]>) => {
          if (result === ApiResponseTypes[ApiResponseTypes.success]) {
            console.log('COL', detail);
            
            setColumns(detail);
          }
        });
      
      await fetchAssignedUsersBoard(parseInt(params.id))
        .then(({ result, detail }: ApiResponse<AssignedUser[]>) => {
          if (result === ApiResponseTypes[ApiResponseTypes.success]) {
            console.log('ASU', detail);
            
            setTeamMembers(detail);
          }
        });
    }
    loadColumns();
  }, [params.id])
  



  const handleDragStart = (task: Task, columnId: number) => {
    setDraggedTask(task)
    setDraggedColumn(columnId)
  }

  const handleDragOver = (e: Event) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: number) => {
    if (draggedTask && draggedColumn !== columnId) {
      // Remove from original column
      const updatedColumns = columns.map((col) => {
        if (col.id === draggedColumn) {
          return {
            ...col,
            tasks: col.tasks!.filter((task) => task.id !== draggedTask.id!),
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

  const handleAddTask = (columnId: number) => {
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
        tasks: col.tasks!.map((task) => {
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
        {columns.map((column: BoardColumn) => (
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
                    {column.columnName} ({column.tasks?.length})
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
                        <DialogDescription>Create a new task for the {column.columnName} column.</DialogDescription>
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
                                  {member.firstName}
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
                  {column.tasks!.map((task: Task) => (
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
                        <div className="font-medium">{task.name}</div>
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
                        {task.assignedUserId && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${task.assignedUser.firstName}`} alt={task.assignedUser.firstName!} />
                                <AvatarFallback>{task.assignedUser.firstName} {task.assignedUser.lastName}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{task.assignedUser.firstName} {task.assignedUser.lastName}</span>
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
                <DialogTitle>{selectedTask.name}</DialogTitle>
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
                    {selectedTask.assignedUser ? (
                      <>
                        <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedTask.assignedUser.firstName}`} alt={selectedTask.assignedUser.firstName!} />
                          <AvatarFallback>{selectedTask.assignedUser.firstName} {selectedTask.assignedUser.lastName}</AvatarFallback>
                        </Avatar>
                        <span>{selectedTask.assignedUser.firstName}</span>
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
                    {selectedTask.comments.map((comment: Comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.userName} alt={comment.userName} />
                          <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatCommentTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{comment.comment}</p>
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

