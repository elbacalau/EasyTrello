import { CreateTaskRequest, Task } from "@/types/tasks";
import { fetchAPI, API_URL } from "./httpClient";
export interface TaskServiceProps {
  boardId: number;
  columnId?: number;
  taskId?: number;
}

export const fetchTasksFromBoard = (boardId: number) => {
  return fetchAPI<Task[]>(`/board/${boardId}/task/find`, {
    method: "POST",
    body: { boardId: boardId },
  });
};

export const moveToColumn = async (taskId: number, columnId: number, boardId: number, targetColumnId: number): Promise<void> => {
  await fetchAPI(`/board/${boardId}/column/${columnId}/task/${taskId}/moveToColumn/${targetColumnId}`, {
    method: "PATCH",
  });
}

export const createTask = async (newTask: CreateTaskRequest) => {
  const boardId: number = newTask.boardId
  const boardColumnId: number = newTask.boardColumnId
  await fetchAPI<void>(`/board/${boardId}/column/${boardColumnId}/task/create`, { method: "POST", body: newTask })
}

export const deleteTask = async (taskProps: TaskServiceProps) => {
  const { boardId, columnId, taskId }: TaskServiceProps = taskProps;
  await fetchAPI(`/board/${boardId}/column/${columnId}/task/${taskId}`, { method: "DELETE" });
}

export const addTaskComment = async (taskProps: TaskServiceProps, comment: string): Promise<void> => {
  const { boardId, taskId }: TaskServiceProps = taskProps;
  const body: { [key: string]: string } = { "comment": comment }
  await fetchAPI<void>(`/board/${boardId}/task/${taskId}/comment`, { method: "POST",  body})
}

export const deleteTaskComment = async (taskProps: TaskServiceProps, commentId: number): Promise<void> => {
  const { boardId, taskId }: TaskServiceProps = taskProps;
  await fetchAPI<void>(`/board/${boardId}/task/${taskId}/comment/${commentId}`, { method: "DELETE" })
}

