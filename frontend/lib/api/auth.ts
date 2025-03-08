import { fetchAPI } from "./httpClient";

export const apiLogin = async (email: string, password: string) => {
  return fetchAPI(`/login`, { method: "POST", body: { email, password } });
}