import { Board, BoardStats } from "@/types/userData";
import { fetchAPI } from "./httpClient";

export const fetchBoards = (userId: number) => {
  console.log('User ID apiService: ', userId);
  
  return fetchAPI<Board[]>(`/board/user/${userId}`, { method: "GET" });
};

export const fetchBoardStats = async (boardId: number) => {
  const url = `/board/${boardId}/stats`;
  try {
    const response = await fetchAPI<BoardStats>(url, { method: "GET" });
    return response;
  } catch (error) {
    throw error;
  }
}