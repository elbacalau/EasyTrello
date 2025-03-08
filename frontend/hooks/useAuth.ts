import { apiLogin } from "@/lib/api/auth";
import { hideLoader, showLoader } from "@/store/slices/loaderSlice";
import { ApiResponse } from "@/types/apiResponse";
import { useAppDispatch } from "@/types/hooks";


interface LoginForm {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();

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
        
        // TODO: add token intercept to client

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
