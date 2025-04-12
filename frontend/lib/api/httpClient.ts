import { ApiResponse } from "@/types/apiResponse";
import { store } from "@/store/store";
import { addNotification } from "@/store/slices/notificationSlice";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5268/api";


export type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: HeadersInit;
  cache?: RequestCache;
  showErrorNotification?: boolean;
};


export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers,
    cache = "no-store",
    showErrorNotification = true
  } = options;


  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include"
  });

  if (method === 'DELETE' || response.status === 204 || response.headers.get('content-length') === '0') {
    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;

      if (showErrorNotification && typeof window !== "undefined") {
        store.dispatch(
          addNotification({
            type: "error",
            message: errorMessage,
            title: `Error ${response.status}`,
            duration: 7000
          })
        );
      }

      throw new Error(errorMessage);
    }

    return { result: "success", detail: null as any } as ApiResponse<T>;
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error("Error al analizar JSON:", error);

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;

      if (showErrorNotification && typeof window !== "undefined") {
        store.dispatch(
          addNotification({
            type: "error",
            message: errorMessage,
            title: `Error ${response.status}`,
            duration: 7000
          })
        );
      }

      throw new Error(errorMessage);
    }

    return { result: "success", detail: null as any } as ApiResponse<T>;
  }

  if (!response.ok) {
    console.error("Error API:", data);

    const errorMessage =
      data?.message || `Error ${response.status}: ${response.statusText}`;

    if (showErrorNotification && typeof window !== "undefined") {
      store.dispatch(
        addNotification({
          type: "error",
          message: errorMessage,
          title: `Error ${response.status}`,
          duration: 7000
        })
      );
    }

    throw new Error(errorMessage);
  }

  return data as ApiResponse<T>;
}
