import { UserData } from "../../interfaces/userData";
import ApiService from "../ApiService";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await ApiService.createData<string>("/auth/login", {
      email,
      password,
    });

    return response.detail;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

export const getUserData = async (): Promise<UserData> => {
  try {
    const response = await ApiService.fetchData<UserData>("/user/userData");

    if (response.result != "success") {
      throw new Error("Error fetching data");
    }

    return response.detail;
    
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};
