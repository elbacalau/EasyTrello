import { useState } from "react";
import { Task, Comment } from "@/types/tasks";
import { addTaskComment, deleteTaskComment } from "@/lib/api/taskService";
import { useAppDispatch } from "@/types/hooks";
import { addNotification } from "@/store/slices/notificationSlice";
import { UserData } from "@/types/userData";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionType } from "@/types/permissionEnum";
import { fetchBoardColumns } from "@/lib/api/boardService";
import { ApiResponseTypes } from "@/types/apiResponse";

export function useCommentManagement(
  boardId: number,
  userData: UserData,
  selectedTask: Task | null,
  setSelectedTask: (task: Task | null) => void,
  loadColumns: () => Promise<void>
) {
  const dispatch = useAppDispatch();
  const [newComment, setNewComment] = useState("");
  const { can, isAdminOrOwner } = usePermissions(boardId);

  const handleAddComment = async () => {
    if (newComment.trim() === "" || !selectedTask) return;

    try {
      if (can(PermissionType.CreateComment)) {
        await addTaskComment({ boardId, taskId: selectedTask.id! }, newComment);
        setNewComment("");
        
        await loadColumns();
        
        const freshColumns = await fetchBoardColumns(boardId);

        if (
          freshColumns.result === ApiResponseTypes[ApiResponseTypes.success]
        ) {
          let updatedTask: Task | undefined;

          for (const column of freshColumns.detail) {
            const found = column.tasks?.find((t) => t.id === selectedTask.id);
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

  const handleDeleteComment = async (commentId: number, taskId: number) => {
    if (!taskId || !commentId) return;

    if (can(PermissionType.DeleteComment)) {
      try {
        await deleteTaskComment(
          { boardId, taskId },
          commentId
        );
        
        await loadColumns();
        
        dispatch(
          addNotification({
            type: "success",
            title: "Éxito",
            message: "Comentario eliminado correctamente",
            duration: 5000,
          })
        );
        
        const freshColumns = await fetchBoardColumns(boardId);
        if (
          freshColumns.result === ApiResponseTypes[ApiResponseTypes.success]
        ) {
          let found = false;
          for (const column of freshColumns.detail) {
            const task = column.tasks?.find((t) => t.id === taskId);
            if (task) {
              setSelectedTask(task);
              found = true;
              break;
            }
          }
          
          if (!found) {
            setSelectedTask(null);
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
    } else {
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: "No tienes permisos para eliminar comentarios",
          duration: 5000,
        })
      );
    }
  };

  const handleCanDeleteComment = (commentId: number): boolean => {
    if (isAdminOrOwner()) {
      return true;
    }
    
    if (!selectedTask || !userData.id) return false;
    
    const comment = selectedTask.comments?.find(c => c.id === commentId);
    if (!comment) return false;
    
    return comment.userId === userData.id;
  };

  return {
    newComment,
    setNewComment,
    handleAddComment,
    handleDeleteComment,
    handleCanDeleteComment
  };
} 