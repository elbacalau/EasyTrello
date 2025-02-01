import { TaskInterface } from "../../interfaces/task";
import { Board } from "../../interfaces/userData";
import ApiService from "../ApiService";

export const getTaskFromBoard = async (
  boardId: number
): Promise<TaskInterface[]> => {
  try {
    const response = await ApiService.createData<TaskInterface[]>(
      `/board/${boardId}/task/find`,
      { boardId }
    );

    return response.detail ?? [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// get columns
export const getColumnsFromBoard = async (
  boardId: number
): Promise<Board[]> => {
  try {
    const response = await ApiService.fetchData<Board[]>(`/board/${boardId}`);

    return response.detail ?? [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};


