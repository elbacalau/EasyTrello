import { ApiResponse } from "@/types/apiResponse";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: HeadersInit;
  cache?: RequestCache;
};

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers, cache = "no-store" } = options;
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || `Error ${response.status}: ${response.statusText}`
    );
  }

  return data as ApiResponse<T>;
}
