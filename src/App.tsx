import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import MarkAttendance from "./pages/employee/Attendance";
import AttendanceHistory from "./pages/employee/History";
import Profile from "./pages/employee/Profile";

// Manager Pages
import ManagerDashboard from "./pages/manager/Dashboard";
import AllEmployees from "./pages/manager/Employees";
import TeamCalendar from "./pages/manager/Calendar";
import Reports from "./pages/manager/Reports";

import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />

      {/* Employee Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MarkAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <AttendanceHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/employees"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <AllEmployees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/calendar"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <TeamCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/reports"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
