import { CreateTaskRequest, Task } from "@/types/tasks";
import { fetchAPI } from "./httpClient";
import { ApiResponseTypes } from "@/types/apiResponse";

export const fetchTasksFromBoard = (boardId: number) => {
  return fetchAPI<Task[]>(`/board/${boardId}/task/find`, {
    method: "POST",
    body: { boardId: boardId },
  });
};

export const moveToColumn = async (taskId: number, columnId: number, boardId: number, targetColumnId: number): Promise<void> =>  {
  await fetchAPI(`/board/${boardId}/column/${columnId}/task/${taskId}/moveToColumn/${targetColumnId}`, {
    method: "PATCH",
  });
}

export const createTask = async (newTask: CreateTaskRequest) => {
  const boardId: number = newTask.boardId
  const boardColumnId: number = newTask.boardColumnId
  await fetchAPI<void>(`/board/${boardId}/column/${boardColumnId}/task/create`, { method: "POST", body: newTask })
}
