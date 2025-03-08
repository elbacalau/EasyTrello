"use client";
import { apiLogin, apiUserData } from "@/lib/api/auth";
import { hideLoader, showLoader } from "@/store/slices/loaderSlice";
import { setUser } from "@/store/slices/userSlice";
import { ApiResponse } from "@/types/apiResponse";
import { useAppDispatch } from "@/types/hooks";
import { UserData } from "@/types/userData";
import { useRouter } from "next/router";

interface LoginForm {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  const userData = async () => {
    try {
      const response: ApiResponse<UserData> = await apiUserData();
      const userData: UserData = response.detail;

      console.log({ userData });
      dispatch(setUser(userData));
    } catch (error) {}
  };

  const login = async (loginForm: LoginForm): Promise<boolean> => {
    try {
      dispatch(showLoader());
      const response: ApiResponse<string> = await apiLogin(
        loginForm.email,
        loginForm.password
      );

      const token: string = response.detail;
      if (response.result == "success" && token) {
        localStorage.setItem("token", token);
        await userData();
        return true
      }
      return false
    } catch (error: any) {
      throw new Error(`Error ${error}`);
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return { login, userData };
};
