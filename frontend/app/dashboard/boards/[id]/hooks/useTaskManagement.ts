import { useState } from "react";
import { Task, TaskPriority, CreateTaskRequest, TaskStatus } from "@/types/tasks";
import { changeAssignedUser, createTask, deleteTask, moveToColumn } from "@/lib/api/taskService";
import { useAppDispatch } from "@/types/hooks";
import { addNotification } from "@/store/slices/notificationSlice";
import { fetchBoardColumns } from "@/lib/api/boardService";
import { ApiResponse, ApiResponseTypes } from "@/types/apiResponse";

export function useTaskManagement(
  boardId: number,
  loadColumns: () => Promise<void>,
  setSelectedTask: (task: Task | null) => void
) {
  const dispatch = useAppDispatch();
  const [draggedTask, setDraggedTask] = useState<Task | undefined>(undefined);
  const [draggedColumn, setDraggedColumn] = useState<number | undefined>(undefined);
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    name: "",
    description: "",
    dueDate: null,
    priority: TaskPriority.Medium,
    boardId: boardId,
    boardColumnId: 0,
    assignedUserId: 0,
    completed: false,
    labels: [],
    comments: [],
  });

  const handleDragStart = (task: Task, columnId: number | undefined) => {
    if (columnId === undefined) return;
    setDraggedTask(task);
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (columnId: number | undefined) => {
    if (
      !draggedTask ||
      draggedColumn === undefined ||
      columnId === undefined ||
      draggedColumn === columnId
    ) {
      setDraggedTask(undefined);
      setDraggedColumn(undefined);
      return;
    }

    try {
      await moveToColumn(
        draggedTask.id!,
        draggedColumn,
        boardId,
        columnId
      );
      await loadColumns();
    } catch (error) {
      console.error("Error al mover tarea:", error);
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: "No se pudo mover la tarea",
          duration: 5000,
        })
      );
    }

    setDraggedTask(undefined);
    setDraggedColumn(undefined);
  };

  const handleAddTask = async (columnId: number) => {
    if (newTask.name.trim() === "" || columnId === undefined) return;

    try {
      await createTask({ ...newTask, boardColumnId: columnId });
      setNewTask({
        name: "",
        description: "",
        dueDate: null,
        priority: TaskPriority.Medium,
        boardId: boardId,
        boardColumnId: 0,
        assignedUserId: newTask.assignedUserId,
        completed: false,
        labels: [],
        comments: [],
      });

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
  };

  const handleDeleteTask = async (taskId: number, columnId: number) => {
    if (taskId === null || boardId === null) return;

    try {
      await deleteTask({
        boardId: boardId,
        columnId: columnId,
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

      setSelectedTask(null);

      await loadColumns();
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

  const handleChangeUser = async (taskId: number, userId: number, columnId: number) => {
    if (taskId === null || boardId === null || userId === null) return;

    console.log(`Iniciando cambio de usuario - Tarea: ${taskId}, Usuario: ${userId}, Columna: ${columnId}`);

    try {
      console.log("Llamando a la API para cambiar usuario...");
      await changeAssignedUser({ boardId, taskId, columnId }, userId);
      console.log("API respondió exitosamente");

      dispatch(
        addNotification({
          type: "success",
          title: "Éxito",
          message: "Usuario asignado correctamente",
          duration: 5000,
        })
      );

      await loadColumns();
      const freshColumns = await fetchBoardColumns(boardId);
      if (freshColumns.result === ApiResponseTypes[ApiResponseTypes.success]) {
        let found = false;
        console.log("Buscando tarea actualizada...");
        for (const column of freshColumns.detail) {
          const task = column.tasks?.find((t: Task) => t.id === taskId);
          if (task) {
            console.log("Tarea encontrada, actualizando selectedTask");
            console.log("Nueva asignación:", task.assignedUserId);
            setSelectedTask(task);
            found = true;
            break;
          }
        }

        if (!found) {
          setSelectedTask(null);
        }
      } else {

      }
    } catch (error) {
      console.error("Error al cambiar usuario asignado:", error);
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: "No se pudo cambiar el usuario asignado",
          duration: 5000,
        })
      );
    }
  }

  return {
    newTask,
    setNewTask,
    draggedTask,
    draggedColumn,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleAddTask,
    handleDeleteTask,
    handleChangeUser,
  };
} 