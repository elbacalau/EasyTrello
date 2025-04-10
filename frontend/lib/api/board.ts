import { AssignedUser, Board, BoardColumn, BoardStats } from "@/types/userData";
import { fetchAPI } from "./httpClient";

export const fetchBoards = (userId: number) => {
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

export const fetchBoardColumns = async (boardId: number) => {
  const url: string = `/board/${boardId}/columns/`
  try {
    const res = await fetchAPI<BoardColumn[]>(url, { method: "GET" });
    return res;
  } catch (error) {
    throw error;
  }  
}

export const fetchAssignedUsersBoard = async (boardId: number) => {
  const url: string = `/board/${boardId}/assignedUsers/`
  try {
    const res = await fetchAPI<AssignedUser[]>(url, { method: "GET" });
    return res;
  } catch (error) {
    throw error;
  }  
}