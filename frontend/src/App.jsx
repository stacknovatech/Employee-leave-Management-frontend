// =============================================
// App.jsx - Router Configuration
// Defines all routes for the application
// Public routes: login, register
// Employee routes: dashboard, apply-leave, my-leaves, calendar
// Manager routes: dashboard, requests, calendar
// =============================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// -- Layouts --
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// -- Auth pages --
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// -- Employee pages --
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import ApplyLeavePage from "@/pages/ApplyLeavePage";
import MyLeaveRequestsPage from "@/pages/MyLeaveRequestsPage";

// -- Manager pages --
import ManagerDashboard from "@/pages/ManagerDashboard";
import ManagerRequestsPage from "@/pages/ManagerRequestsPage";

// -- Shared pages --
import LeaveCalendarPage from "@/pages/LeaveCalendarPage";

// -- Route guard --
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications - sonner library */}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: "'Poppins', sans-serif",
          },
        }}
      />

      <Routes>
        {/* =========== Public Routes =========== */}
        {/* Auth layout wraps login & register with centered card design */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* =========== Employee Routes =========== */}
        {/* Dashboard layout wraps with navbar + sidebar */}
        <Route
          element={
            <ProtectedRoute allowedRole="employee">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/apply-leave" element={<ApplyLeavePage />} />
          <Route path="/employee/my-leaves" element={<MyLeaveRequestsPage />} />
          <Route path="/employee/calendar" element={<LeaveCalendarPage />} />
        </Route>

        {/* =========== Manager Routes =========== */}
        <Route
          element={
            <ProtectedRoute allowedRole="manager">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/requests" element={<ManagerRequestsPage />} />
          <Route path="/manager/calendar" element={<LeaveCalendarPage />} />
        </Route>

        {/* =========== Fallback Routes =========== */}
        {/* Root pe aaye toh login pe bhejo */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* koi aur route nahi mila toh bhi login pe bhejo */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
