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
  
  const userData = async (): Promise<UserData | null> => {
    try {
      dispatch(showLoader());
      const response: ApiResponse<UserData> = await apiUserData();
      
      if (response.result === "success" && response.detail) {
        const userData: UserData = response.detail;
        console.log("Datos de usuario cargados:", userData);
        dispatch(setUser(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return null;
    } finally {
      dispatch(hideLoader());
    }
  };

  const login = async (loginForm: LoginForm): Promise<boolean> => {
    try {
      dispatch(showLoader());
      const response: ApiResponse<string> = await apiLogin(
        loginForm.email,
        loginForm.password
      );

      if (response.result === "success" && response.detail) {
        const token: string = response.detail;
        console.log("Token obtenido:", token);
        localStorage.setItem("token", token);
        
        const user = await userData();
        return user !== null;
      }
      return false;
    } catch (error: any) {
      console.error("Error en el login:", error);
      return false;
    } finally {
      dispatch(hideLoader());
    }
  };

  return { login, userData };
};
