import { fetchAPI } from "./httpClient";

export const login = async (email: string, password: string) => {
  return fetchAPI(`/login`, { method: "POST", body: { email, password } });
}