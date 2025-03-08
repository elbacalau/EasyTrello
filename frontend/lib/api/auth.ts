import { UserData } from "@/types/userData";
import { fetchAPI } from "./httpClient";

interface LoginResponse {
  token: string;
}

export const apiLogin = async (email: string, password: string) => {
  return fetchAPI<string>(`/auth/login`, { method: "POST", body: { email, password } });
}

export const apiUserData = async () => {
  return fetchAPI<UserData>(`/user/userData`, {method: "GET"});
}