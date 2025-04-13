import { UserData } from "@/types/userData";
import { fetchAPI } from "./httpClient";
import { Permission } from "@/types/permission";


export const apiLogin = async (email: string, password: string) => {
  return fetchAPI<string>(`/auth/login`, { method: "POST", body: { email, password } });
}

export const apiUserData = async () => {
  return fetchAPI<UserData>(`/user/userData`, {method: "GET"});
}

export const getPermissions = async (boardId: number) => {
  return fetchAPI<Permission>(`/permissions/board/${boardId}/my`, {method: "GET"});
}
