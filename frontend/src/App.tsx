import { useDispatch } from "react-redux";
import AppRouter from "./router";
import { useEffect } from "react";
import { getUserData } from "./api/services/auth/authService";
import { loginSuccess } from "./features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await getUserData();
          console.log("User app.tsx: ", user);

          dispatch(
            loginSuccess({
              token,
              user,
            })
          );
        } catch (error) {
          console.log(error);
          localStorage.removeItem("token");
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <AppRouter />;
};

export default App;
