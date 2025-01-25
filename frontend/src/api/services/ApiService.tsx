import { baseUrl } from "../../utils/const";



class ApiService {
  
  private static async request<T extends unknown>(
    url: string,
    method: string,
    body?: object
  ): Promise<T> {
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
      
      const response = await fetch(`${baseUrl}${url}`, options);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

 
  public static async fetchData<T extends unknown>(
    endpoint: string
  ): Promise<T> {
    return this.request<T>(`${endpoint}`, "GET");
  }

  
  public static async createData<T extends unknown>(
    endpoint: string,
    body: object
  ): Promise<T> {
    return this.request<T>(`${endpoint}`, "POST", body);
  }

 
  public static async updateData<T extends unknown>(
    endpoint: string,
    body: object
  ): Promise<T> {
    return this.request<T>(`${endpoint}`, "PUT", body);
  }

  
  public static async deleteData<T extends unknown>(
    endpoint: string
  ): Promise<T> {
    return this.request<T>(`${endpoint}`, "DELETE");
  }

  public static async patchData<T extends unknown>(
    endpoint: string,
    body: object
  ): Promise<T> {
    return this.request<T>(`${endpoint}`, "PATCH", body);
  }
}

export default ApiService;
