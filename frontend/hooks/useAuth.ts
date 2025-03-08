import { apiLogin } from "@/lib/api/auth";
import { setLoading, setUser } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface LoginResponse {
  email
  token: string;
}

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      dispatch(setUser({ email: "user@example.com", token: storedToken }));
    }
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const token = await apiLogin(email, password);
    } catch (error) {
      
    }
  }
}
