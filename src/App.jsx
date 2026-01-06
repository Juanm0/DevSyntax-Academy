import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Nuevos dashboards
import DashboardAlumno from "./pages/DashboardAlumno";
import DashboardProfesor from "./pages/DashboardProfesor";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/course/:id" element={<Course />} />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ALUMNO */}
        <Route
          path="/dashboard-alumno"
          element={
            <ProtectedRoute>
              <DashboardAlumno />
            </ProtectedRoute>
          }
        />

        {/* PROFESOR */}
        <Route
          path="/dashboard-profesor"
          element={
            <ProtectedRoute>
              <DashboardProfesor />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
