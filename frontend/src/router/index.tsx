import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login  from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<Login />} />

        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

       
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
