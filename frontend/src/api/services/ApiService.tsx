import { APIResponse, ErrorResponse } from "../interfaces/apiResponse";
import { baseUrl } from "../../utils/const";


class ApiService {
  private static async request<T>(
    endpoint: string,
    method: string,
    body?: object
  ): Promise<APIResponse<T>> {
    try {
      const token = localStorage.getItem("token");
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      };

      const url = `${baseUrl}${endpoint}`;
      const response = await fetch(url, options);

      
      const data: APIResponse<T> = await response.json();

      
      if (!response.ok || data.result === "error") {
        const errorDetail = data.detail as unknown as ErrorResponse;
        throw new Error(errorDetail.message || "Unknown error occurred");
      }

      return data;
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      throw error;
    }
  }

  public static async fetchData<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, "GET");
  }

  public static async createData<T>(
    endpoint: string,
    body: object
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, "POST", body);
  }

  public static async updateData<T>(
    endpoint: string,
    body: object
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, "PUT", body);
  }

  public static async deleteData<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, "DELETE");
  }

  public static async patchData<T>(
    endpoint: string,
    body: object
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, "PATCH", body);
  }
}

export default ApiService;
