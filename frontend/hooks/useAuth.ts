import { apiLogin } from "@/lib/api/auth";
import { hideLoader, showLoader } from "@/store/slices/loaderSlice";
import { ApiResponse } from "@/types/apiResponse";
import { useAppDispatch } from "@/types/hooks";

interface LoginResponse {
  token: string;
}

interface LoginForm {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const login = async (loginForm: LoginForm) => {
    try {
      dispatch(showLoader());
      const response: ApiResponse<LoginResponse> = await apiLogin(
        loginForm.email,
        loginForm.password
      );

      const { token } = response.detail;
      if (token) {
        console.log("token: ", { token });

        localStorage.setItem("token", token);
        // TODO: make the fetch for user data
      }
    } catch (error: any) {
      throw new Error(`Error ${error}`);
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };


  return {login};
};

  