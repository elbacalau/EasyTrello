import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login  from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";
import Layout from "../layouts/Layout";
import { UserData } from "../api/interfaces/userData";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

const AppRouter = () => {

  const user: UserData | null = useSelector(
    (state: RootState) => state.auth.user
  );
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<Login />} />

        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout user={user}/>
            </PrivateRoute>
          }
        />

       
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
