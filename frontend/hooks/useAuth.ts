import { apiLogin, apiUserData } from "@/lib/api/auth";
import { hideLoader, showLoader } from "@/store/slices/loaderSlice";
import { ApiResponse } from "@/types/apiResponse";
import { useAppDispatch } from "@/types/hooks";
import { UserData } from "@/types/userData";
import { useEffect } from "react";


interface LoginForm {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();

  
  const userData = async () => {
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response: ApiResponse<UserData> = await apiUserData();
          const userData: UserData = response.detail;
          return response;
          
        } catch (error) {
          
        }
      };
      fetchUserData();
    }, []);


  }

  const login = async (loginForm: LoginForm) => {
    try {
      dispatch(showLoader());
      const response: ApiResponse<string> = await apiLogin(
        loginForm.email,
        loginForm.password
      );
      
      const token: string = response.detail;
      if (response.result == 'success' && token) {
        localStorage.setItem('token', token)
        userData();
        // TODO: fetch User data
      }
    } catch (error: any) {
      throw new Error(`Error ${error}`);
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return { login };
};
