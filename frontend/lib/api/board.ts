import { Board } from "@/types/userData";
import { fetchAPI } from "./httpClient";

export const fetchBoards = (userId: number) => {
  return fetchAPI<Board[]>(`/board/${userId}`, { method: "GET" });
};
