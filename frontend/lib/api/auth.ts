import { fetchAPI } from "./httpClient";

interface LoginResponse {
  token: string;
}

export const apiLogin = async (email: string, password: string) => {
  return fetchAPI<string>(`/auth/login`, { method: "POST", body: { email, password } });
}