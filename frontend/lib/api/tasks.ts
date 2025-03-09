import { Task } from "@/types/tasks";
import { fetchAPI } from "./httpClient";

export const fetchTasksFromBoard = (boardId: number) => {
  return fetchAPI<Task[]>(`/board/1/task/find`, {
    method: "POST",
    body: { boardId: boardId },
  });
};
