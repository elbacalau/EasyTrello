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
  
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem("token");
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error API:", data);
    
    const errorMessage = data?.message || `Error ${response.status}: ${response.statusText}`;
    
    if (showErrorNotification && typeof window !== 'undefined') {
      store.dispatch(
        addNotification({
          type: "error",
          message: errorMessage,
          title: `Error ${response.status}`,
          duration: 7000,
        })
      );
    }
    
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        
        if (!endpoint.includes("/auth/login")) {
          console.log("Sesión expirada. Redirigiendo al login...");
          window.location.href = "/login";
        }
      }
    }
    
    throw new Error(errorMessage);
  }

  return data as ApiResponse<T>;
}
