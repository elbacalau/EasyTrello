"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Calendar, User, Tag } from "lucide-react";
import { fetchAssignedUsersBoard, fetchBoardColumns } from "@/lib/api/board";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { ApiResponse, ApiResponseTypes } from "@/types/apiResponse";
import { AssignedUser, Board, UserData } from "@/types/userData";
import { Comment, Task, TaskStatus, TaskPriority, CreateTaskRequest } from "@/types/tasks";
import { BoardColumn } from "@/types/boardColumn";
import { moveToColumn } from "@/lib/api/tasks";
import { useAppSelector } from "@/types/hooks";
import { getPermissions } from "@/lib/api/auth";
import { Permission } from "@/types/permission";
import { BoardRole, PermissionType } from "@/types/permissionEnum";
import { usePermissions } from "@/hooks/usePermissions";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Sample data for the board

export default function BoardPage() {
  const params: Params = useParams();
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [teamMembers, setTeamMembers] = useState<AssignedUser[]>([]);
  const [selectedMember, setSelectedMember] = useState<AssignedUser | null>(null);
  const [filteredColumns, setFilteredColumns] = useState<BoardColumn[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    name: "",
    description: "",
    dueDate: new Date(),
    priority: TaskPriority.Medium,
    boardId: parseInt(params.id),
    boardColumnId: 0,
    assignedUserId: 0,
    completed: false,
    labels: [],
    comments: [],
  });

  
  const [newComment, setNewComment] = useState("");
  const [draggedTask, setDraggedTask] = useState<Task | undefined>(undefined);
  const [draggedColumn, setDraggedColumn] = useState<number | undefined>(
    undefined
  );

  const userData: UserData = useAppSelector((state) => state.user);
  const currentBoard: Board | undefined = useMemo(() => {
    return userData?.boards.find((board) => board.id === parseInt(params.id));
  }, [params.id, userData]);

  const {
    permissions,
    can,
    isAdminOrOwner,
    loading,
    reload,
    error,
    hasRoleOf,
    isOwner,
    isViewer,
  } = usePermissions(parseInt(params.id));

  useEffect(() => {
    const loadColumns = async () => {
      await fetchBoardColumns(parseInt(params.id)).then(
        ({ result, detail }: ApiResponse<BoardColumn[]>) => {
          if (result === ApiResponseTypes[ApiResponseTypes.success]) {
            setColumns(detail);
            setFilteredColumns(detail);
          }
        }
      );

      await fetchAssignedUsersBoard(parseInt(params.id)).then(
        ({ result, detail }: ApiResponse<AssignedUser[]>) => {
          if (result === ApiResponseTypes[ApiResponseTypes.success]) {
            setTeamMembers(detail);
          }
        }
      );
    };

    loadColumns();
  }, [params.id]);

  const handleDragStart = (task: Task, columnId: number | undefined) => {
    if (columnId === undefined) return;
    setDraggedTask(task);
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: number | undefined) => {
    if (
      draggedTask &&
      draggedColumn !== undefined &&
      columnId !== undefined &&
      draggedColumn !== columnId
    ) {
      const updatedColumns = columns.map((col) => {
        if (col.id === draggedColumn) {
          return {
            ...col,
            tasks:
              col.tasks?.filter((task) => task.id !== draggedTask.id) || [],
          };
        }
        return col;
      });

      const finalColumns = updatedColumns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...(col.tasks || []), draggedTask],
          };
        }
        return col;
      });

      setColumns(finalColumns);
      
      if (selectedMember) {
        const filtered = finalColumns.map(column => ({
          ...column,
          tasks: column.tasks?.filter(task => task.assignedUserId === selectedMember.id) || []
        }));
        setFilteredColumns(filtered);
      } else {
        setFilteredColumns(finalColumns);
      }

      moveToColumn(
        draggedTask.id!,
        draggedColumn,
        parseInt(params.id),
        columnId
      );
    }
    setDraggedTask(undefined);
    setDraggedColumn(undefined);
  };

  const handleAddTask = (columnId: number | undefined) => {
    if (newTask.name.trim() === "" || columnId === undefined) return;

    const task: Task = {
      id: Math.floor(Math.random() * 1000),
      name: newTask.name,
      description: newTask.description,
      createdAt: new Date(),
      updatedAt: null,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      priority: newTask.priority,
      status: TaskStatus.ToDo,
      assignedUserId: newTask.assignedUserId,
      boardId: parseInt(params.id),
      boardColumnId: columnId,
      comments: [],
      labels: [],
    };

    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...(col.tasks || []), task],
        };
      }
      return col;
    });

    setColumns(updatedColumns);
    setNewTask({
      name: "",
      description: "",
      dueDate: new Date(),
      priority: TaskPriority.Medium,
      boardId: parseInt(params.id),
      boardColumnId: columnId,
      assignedUserId: newTask.assignedUserId,
      completed: false,
      labels: [],
      comments: [],
    });
    setIsNewTaskDialogOpen(false);

    if (can(PermissionType.CreateTask)) {
      // TODO: Call API to create a new task on the server
      console.log({ ...newTask, boardColumnId: columnId });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() === "" || !selectedTask) return;

    const currentUser = teamMembers.length > 0 ? teamMembers[0] : null;
    if (!currentUser) return;

    const comment: Comment = {
      id: Math.floor(Math.random() * 1000),
      comment: newComment,
      createdAt: new Date(),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
    };

    const updatedColumns = columns.map((col) => {
      return {
        ...col,
        tasks:
          col.tasks?.map((task) => {
            if (task.id === selectedTask.id) {
              return {
                ...task,
                comments: [...(task.comments || []), comment],
              };
            }
            return task;
          }) || [],
      };
    });

    setColumns(updatedColumns);
    setNewComment("");

    const updatedTask = updatedColumns
      .flatMap((col) => col.tasks || [])
      .find((task) => task && task.id === selectedTask.id);

    if (updatedTask) {
      setSelectedTask(updatedTask);
    }

    if (can(PermissionType.CreateComment)) {
      // TODO: Call API to add a comment on the server
    }
  };

  const handleSelectMember = (member: AssignedUser) => {
    if (member.id === null) return;
    
    setSelectedMember(member);
    
    if (member) {
      const filtered = columns.map(column => ({
        ...column,
        tasks: column.tasks?.filter(task => task.assignedUserId === member.id) || []
      }));
      setFilteredColumns(filtered);
    } else {
      setFilteredColumns(columns);
    }
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.Critical:
        return "bg-destructive/10 text-destructive";
      case TaskPriority.High:
        return "bg-destructive/10 text-destructive";
      case TaskPriority.Medium:
        return "bg-amber-500/10 text-amber-500";
      case TaskPriority.Low:
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string | Date | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCommentTime = (timestamp: string | Date | null): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentBoard?.name}
          </h1>
          <p className="text-muted-foreground">{currentBoard?.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdminOrOwner() ? (
            <Button variant="outline" size="sm">
              <User className="mr-2 h-4 w-4" />
              Invite
            </Button>
          ) : null}

          {isAdminOrOwner() ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Board</DropdownMenuItem>
                <DropdownMenuItem>Board Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      <Breadcrumb
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Boards", href: "/dashboard/boards" },
          {
            name: currentBoard?.name || "",
            href: `/dashboard/boards/${currentBoard?.id}`,
            current: true,
          },
        ]}
      />

      <div className="flex items-center">
        {teamMembers.slice(0, 5).map((member: AssignedUser, index: number) => (
          <HoverCard key={member.id}>
            <HoverCardTrigger asChild>
              <div
                className={`w-10 h-10 rounded-full border-2 border-white overflow-hidden transition-transform hover:scale-105 hover:ring-2 hover:ring-blue-400 cursor-pointer ${
                  index !== 0 ? "-ml-3" : ""
                } ${
                  selectedMember?.id === member.id 
                    ? "ring-2 ring-blue-400" 
                    : ""
                }`}
                onClick={() => {
                  handleSelectMember(member)
                }}
              >
                <img
                  src={`https://i.pravatar.cc/150?u=${member.firstName}`}
                  alt={member.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              <div className="flex items-center gap-2">
                <img
                  src={`https://i.pravatar.cc/150?u=${member.firstName}`}
                  alt={member.firstName}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}

        {teamMembers.length > 5 && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="-ml-3 w-10 h-10 rounded-full border-2 border-white bg-gray-200 text-sm flex items-center justify-center font-medium text-gray-600 hover:scale-105 hover:ring-2 hover:ring-blue-400 transition-transform cursor-pointer">
                +{teamMembers.length - 5}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              <div className="space-y-2">
                <p className="font-medium">Miembros adicionales</p>
                <div className="space-y-1">
                  {teamMembers.slice(5).map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-2 cursor-pointer ${
                        selectedMember?.id === member.id 
                          ? "ring-2 ring-blue-400 rounded-full p-1" 
                          : ""
                      }`}
                      onClick={() => handleSelectMember(member)}
                    >
                      <img
                        src={`https://i.pravatar.cc/150?u=${member.firstName}`}
                        alt={member.firstName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">
                        {member.firstName} {member.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}

        {selectedMember && (
          <div className="ml-4 flex items-center gap-2">
            <span className="text-sm">
              Filtrado por: {selectedMember.firstName} {selectedMember.lastName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedMember(null);
                setFilteredColumns(columns);
              }}
            >
              Limpiar filtro
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-6 h-[calc(90vh-16rem)]">
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4">
            {filteredColumns.map((column: BoardColumn) => (
              <div
                key={column.id}
                className="flex-shrink-0 w-80"
                onDragOver={isViewer() ? undefined : handleDragOver}
                onDrop={isViewer() ? undefined : () => handleDrop(column.id)}
              >
                <Card className="h-full">
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {column.columnName} ({column.tasks?.length || 0})
                      </CardTitle>
                      <Dialog
                        open={isNewTaskDialogOpen}
                        onOpenChange={setIsNewTaskDialogOpen}
                      >
                        <DialogTrigger asChild>
                          {isViewer() ? null : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                              <span className="sr-only">Add task</span>
                            </Button>
                          )}
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription>
                              Create a new task for the {column.columnName}{" "}
                              column.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="title">Task Title</Label>
                              <Input
                                id="title"
                                placeholder="Enter task title"
                                value={newTask.name}
                                onChange={(e) =>
                                  setNewTask({
                                    ...newTask,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                placeholder="Enter task description"
                                value={newTask.description}
                                onChange={(e) =>
                                  setNewTask({
                                    ...newTask,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="dueDate">Due Date</Label>
                              <Input
                                id="dueDate"
                                type="date"
                                value={newTask.dueDate.toISOString()}
                                onChange={(e) =>
                                  setNewTask({
                                    ...newTask,
                                    dueDate: new Date(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="priority">Priority</Label>
                              <Select
                                value={newTask.priority.toString()}
                                onValueChange={(value) =>
                                  setNewTask({ ...newTask, priority: parseInt(value) as TaskPriority })
                                }
                              >
                                <SelectTrigger id="priority">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={TaskPriority.Low.toString()}>Low</SelectItem>
                                  <SelectItem value={TaskPriority.Medium.toString()}>Medium</SelectItem>
                                  <SelectItem value={TaskPriority.High.toString()}>High</SelectItem>
                                  <SelectItem value={TaskPriority.Critical.toString()}>Critical</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="assignee">Assignee</Label>
                              <Select
                                onValueChange={(value) => {
                                  const assignee = teamMembers.find(
                                    (member) => member.id.toString() === value
                                  );
                                  setNewTask({ ...newTask, assignedUserId: assignee?.id! });
                                }}
                              >
                                <SelectTrigger id="assignee">
                                  <SelectValue placeholder="Assign to..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {teamMembers.map((member) => (
                                    <SelectItem
                                      key={member.id}
                                      value={member.id.toString()}
                                    >
                                      {member.firstName} {member.lastName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsNewTaskDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={() => handleAddTask(column.id)}>
                              Add Task
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>

                  {/* TASK CARD */}
                  <CardContent className="px-4 pb-4 pt-0 overflow-y-auto max-h-[calc(100vh-300px)]">
                    <div className="space-y-3">
                      {column.tasks?.map((task: Task) => {
                        
                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={() => handleDragStart(task, column.id)}
                            className="rounded-md border bg-card shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing"
                          >
                            <div
                              className="p-3 space-y-3"
                              onClick={() => {
                                setSelectedTask(task);
                              }}
                            >
                              <div className="font-medium">{task.name}</div>
                              <div className="flex items-center justify-between">
                                {task.dueDate && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {formatDate(task.dueDate)}
                                  </div>
                                )}
                                <div
                                  className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                                    task.priority!
                                  )}`}
                                >
                                  {task.priority}
                                </div>
                              </div>
                              {task.assignedUserId && task.assignedUser && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={`https://i.pravatar.cc/150?u=${task.assignedUser.firstName}`}
                                        alt={task.assignedUser.firstName || ""}
                                      />
                                      <AvatarFallback>
                                        {task.assignedUser.firstName?.[0] || ""}
                                        {task.assignedUser.lastName?.[0] || ""}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">
                                      {task.assignedUser.firstName}{" "}
                                      {task.assignedUser.lastName}
                                    </span>
                                  </div>
                                  {task.comments?.length &&
                                    task.comments.length > 0  ? (
                                      <div className="text-xs text-muted-foreground">
                                        {task.comments.length} comment
                                        {task.comments.length !== 1 ? "s" : ""}
                                      </div>
                                    ): (
                                      <div className="text-xs text-muted-foreground">
                                        No comments
                                      </div>
                                    )}
                                  
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {selectedTask && (
          <div className="w-[calc(50%-16rem)] h-fit">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{selectedTask.name}</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[calc(100vh-300px)]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedTask.description || "No description provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Due Date</h3>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(selectedTask.dueDate || "") ||
                            "No due date"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Priority</h3>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                          selectedTask.priority || TaskPriority.Medium
                        )}`}
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {selectedTask.priority ? TaskPriority[selectedTask.priority] : "Medium"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Assignee</h3>
                    <div className="flex items-center gap-2">
                      {selectedTask.assignedUser ? (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://i.pravatar.cc/150?u=${selectedTask.assignedUser.firstName}`}
                              alt={selectedTask.assignedUser.firstName || ""}
                            />
                            <AvatarFallback>
                              {selectedTask.assignedUser.firstName?.[0] || ""}
                              {selectedTask.assignedUser.lastName?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {selectedTask.assignedUser.firstName}{" "}
                            {selectedTask.assignedUser.lastName}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Unassigned
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Comments</h3>
                      <span className="text-xs text-muted-foreground">
                        {selectedTask.comments?.length || 0} comment
                        {(selectedTask.comments?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {selectedTask.comments?.map((comment: Comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://i.pravatar.cc/150?u=${comment.userName}`}
                              alt={comment.userName}
                            />
                            <AvatarFallback>
                              {comment.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {comment.userName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatCommentTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                      />
                      <Button onClick={handleAddComment}>Post</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
