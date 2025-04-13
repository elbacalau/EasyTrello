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
import {
  Comment,
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskRequest,
} from "@/types/tasks";
import { BoardColumn } from "@/types/boardColumn";
import {
  addTaskComment,
  createTask,
  deleteTask,
  moveToColumn,
  TaskServiceProps,
} from "@/lib/api/tasks";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { PermissionType } from "@/types/permissionEnum";
import { usePermissions } from "@/hooks/usePermissions";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { addNotification } from "@/store/slices/notificationSlice";
import SelectedTaskCard from "@/components/selected-task";
import { toast } from "sonner";

// Sample data for the board

export default function BoardPage() {
  const dispatch = useAppDispatch();
  const params: Params = useParams();
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [teamMembers, setTeamMembers] = useState<AssignedUser[]>([]);
  const [selectedMember, setSelectedMember] = useState<AssignedUser | null>(
    null
  );
  const [filteredColumns, setFilteredColumns] = useState<BoardColumn[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    name: "",
    description: "",
    dueDate: null,
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

  const { can, isAdminOrOwner, isViewer } = usePermissions(parseInt(params.id));
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);

  useEffect(() => {
    loadColumns();
  }, [params.id]);

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
        const filtered = finalColumns.map((column) => ({
          ...column,
          tasks:
            column.tasks?.filter(
              (task) => task.assignedUserId === selectedMember.id
            ) || [],
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

  const handleAddTask = async (columnId: number) => {
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
      dueDate: null,
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
      try {
        await createTask({ ...newTask, boardColumnId: columnId });
        dispatch(
          addNotification({
            type: "success",
            title: "Éxito",
            message: "Tarea creada correctamente",
            duration: 5000,
          })
        );

        await loadColumns();
      } catch (error) {
        dispatch(
          addNotification({
            type: "error",
            title: "Error",
            message: "Hubo un problema al crear la tarea",
            duration: 5000,
          })
        );
      }
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "" || !selectedTask) return;
    if (!currentBoard) return;

    const boardId = currentBoard.id;
    const taskId = selectedTask.id;

    try {
      if (can(PermissionType.CreateComment)) {
        await addTaskComment({ boardId, taskId }, newComment);
        setNewComment("");
        await loadColumns();
        const freshColumns = await fetchBoardColumns(parseInt(params.id));

        if (
          freshColumns.result === ApiResponseTypes[ApiResponseTypes.success]
        ) {
          let updatedTask: Task | undefined;

          for (const column of freshColumns.detail) {
            const found = column.tasks?.find((t) => t.id === taskId);
            if (found) {
              updatedTask = found;
              break;
            }
          }

          if (updatedTask) {
            setSelectedTask(updatedTask);
          }
        }

        dispatch(
          addNotification({
            type: "success",
            title: "Éxito",
            message: "Comentario añadido correctamente",
            duration: 5000,
          })
        );
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: "Error al crear el comentario",
          duration: 5000,
        })
      );
    }
  };




  const handleSelectMember = (member: AssignedUser) => {
    if (member.id === null) return;

    setSelectedMember(member);

    if (member) {
      const filtered = columns.map((column) => ({
        ...column,
        tasks:
          column.tasks?.filter((task) => task.assignedUserId === member.id) ||
          [],
      }));
      setFilteredColumns(filtered);
    } else {
      setFilteredColumns(columns);
    }
  };

  const handleDeleteTask = async (taskId: number, columnId: number) => {
    if (taskId === null) return;
    if (currentBoard?.id === null) return;

    try {
      const columnaId = selectedColumnId || columnId;

      await deleteTask({
        boardId: currentBoard!.id!,
        columnId: columnaId,
        taskId: taskId,
      });

      dispatch(
        addNotification({
          type: "success",
          title: "Éxito",
          message: "Tarea eliminada correctamente",
          duration: 5000,
        })
      );

      loadColumns();
      setSelectedTask(null);
    } catch (error) {
      console.error("Error al eliminar tarea:", error);

      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: "No se pudo eliminar la tarea",
          duration: 5000,
        })
      );
    }
  };

  const getResaltedText = (term: string, text?: string) => {
    if (!term) return text;
    if (!text) return;
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((parte, i) =>
      regex.test(parte) ? (
        <mark key={i} className="bg-yellow-200 text-black px-0.5">
          {parte}
        </mark>
      ) : (
        parte
      )
    );
  };

  const getPriorityColor = (priority: any): string => {
    if (typeof priority === "string") {
      if (priority === "Low" || priority === "low")
        return "bg-green-500/10 text-green-500";
      if (priority === "Medium" || priority === "medium")
        return "bg-amber-500/10 text-amber-500";
      if (priority === "High" || priority === "high")
        return "bg-destructive/10 text-destructive";
      if (priority === "Critical" || priority === "critical")
        return "bg-destructive/10 text-destructive";
    }

    const priorityNum = Number(priority);
    if (!isNaN(priorityNum)) {
      if (priorityNum === 4) return "bg-destructive/10 text-destructive"; // Critical
      if (priorityNum === 3) return "bg-destructive/10 text-destructive"; // High
      if (priorityNum === 2) return "bg-amber-500/10 text-amber-500"; // Medium
      if (priorityNum === 1) return "bg-green-500/10 text-green-500"; // Low
    }

    return "bg-muted text-muted-foreground";
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

  const handleDeleteComment = async (commentId: number, taskId: number) => {
    if (!currentBoard || !taskId || !commentId) return;
    
    try {
      // Aquí añadirías la llamada a la API para eliminar el comentario
      // Por ejemplo: await deleteTaskComment({ boardId: currentBoard.id, taskId, commentId });
      
      // Por ahora, solo mostraremos una notificación y recargaremos los datos
      console.log(`Eliminando comentario ${commentId} de la tarea ${taskId}`);
      
      dispatch(
        addNotification({
          type: "success",
          title: "Éxito",
          message: "Comentario eliminado correctamente",
          duration: 5000,
        })
      );
      
      // Recargar los datos
      await loadColumns();
      
      // Buscar la tarea actualizada y seleccionarla
      const freshColumns = await fetchBoardColumns(parseInt(params.id));
      
      if (freshColumns.result === ApiResponseTypes[ApiResponseTypes.success]) {
        // Buscar la tarea actualizada en todas las columnas
        for (const column of freshColumns.detail) {
          const found = column.tasks?.find(t => t.id === taskId);
          if (found) {
            setSelectedTask(found);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: "No se pudo eliminar el comentario",
          duration: 5000,
        })
      );
    }
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
        <div className="mr-4">
          <Input
            placeholder="Search task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {teamMembers.slice(0, 5).map((member: AssignedUser, index: number) => (
          <HoverCard key={member.id}>
            <HoverCardTrigger asChild>
              <div
                className={`w-10 h-10 rounded-full border-2 border-white overflow-hidden transition-transform hover:scale-105 hover:ring-2 hover:ring-blue-400 cursor-pointer ${
                  index !== 0 ? "-ml-3" : ""
                } ${
                  selectedMember?.id === member.id ? "ring-2 ring-blue-400" : ""
                }`}
                onClick={() => {
                  handleSelectMember(member);
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

        {(selectedMember || searchTerm.length > 0) && (
          <div className="ml-4 flex items-center gap-2">
            <span className="text-sm">
              {selectedMember &&
                `Filtrado por: ${selectedMember.firstName} ${selectedMember.lastName}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedMember(null);
                setFilteredColumns(columns);
                setSearchTerm("");
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
                      {isViewer() ? null : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedColumnId(column.id!);
                            setIsNewTaskDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add task</span>
                        </Button>
                      )}
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
                                setSelectedColumnId(task.boardColumnId!);
                              }}
                            >
                              <div className="font-medium">
                                {searchTerm
                                  ? getResaltedText(searchTerm, task.name)
                                  : task.name}
                              </div>
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
                                  task.comments.length > 0 ? (
                                    <div className="text-xs text-muted-foreground">
                                      {task.comments.length} comment
                                      {task.comments.length !== 1 ? "s" : ""}
                                    </div>
                                  ) : (
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

        {/* CARGAMOS COMPONENTE DE LA TAREA SELECCIONADA */}
        {selectedTask && (
          <SelectedTaskCard
            key={`task-${selectedTask.id}-${
              selectedTask.comments?.length || 0
            }`}
            selectedTask={selectedTask}
            newComment={newComment}
            columnId={selectedTask.boardColumnId || 0}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            formatDate={formatDate}
            formatCommentTime={formatCommentTime}
            getPriorityColor={getPriorityColor}
            handleDeleteTask={handleDeleteTask}
            handleDeleteComment={handleDeleteComment}
          />
        )}
      </div>

      {/* DIALOG PARA CREAR NUEVA TAREA */}
      <Dialog
        open={isNewTaskDialogOpen}
        onOpenChange={(open) => {
          setIsNewTaskDialogOpen(open);
          if (!open) {
            setSelectedColumnId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for the{" "}
              {
                filteredColumns.find((col) => col.id === selectedColumnId)
                  ?.columnName
              }{" "}
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
              <div className="flex gap-2">
                <Input
                  id="dueDate"
                  type="date"
                  value={
                    newTask.dueDate
                      ? new Date(newTask.dueDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      dueDate: e.target.value ? new Date(e.target.value) : null,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const today = new Date();
                    setNewTask({
                      ...newTask,
                      dueDate: today,
                    });
                  }}
                >
                  Hoy
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTask.priority.toString()}
                onValueChange={(value) =>
                  setNewTask({
                    ...newTask,
                    priority: parseInt(value) as TaskPriority,
                  })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskPriority.Low.toString()}>
                    Low
                  </SelectItem>
                  <SelectItem value={TaskPriority.Medium.toString()}>
                    Medium
                  </SelectItem>
                  <SelectItem value={TaskPriority.High.toString()}>
                    High
                  </SelectItem>
                  <SelectItem value={TaskPriority.Critical.toString()}>
                    Critical
                  </SelectItem>
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
                    <SelectItem key={member.id} value={member.id.toString()}>
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
            <Button
              onClick={() =>
                selectedColumnId && handleAddTask(selectedColumnId)
              }
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
