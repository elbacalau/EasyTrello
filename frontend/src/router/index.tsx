import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";
import Layout from "../layouts/Layout";
import Projects from "../pages/Projects";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Dashboard } from "../pages/Dashboard";
import { Calendar } from "../pages/Calendar";
import { Team } from "../pages/Team";

const AppRouter = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout user={user} />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="team" element={<Team />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="projects" element={<Projects />} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
