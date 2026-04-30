import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import UserFeedback from "../pages/student/UserFeedback";
import StudentDashboard from "../pages/student/StudentDashboard";
import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard";
import SupervisorAssignedStudents from "../pages/supervisor/SupervisorAssignedStudents";
import SupervisorFeedback from "../pages/supervisor/SupervisorFeedback";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SubmitLog from "../pages/student/SubmitLog";
import WeeklyLogs from "../pages/student/WeeklyLogs";
import InternshipDetails from "../pages/student/InternshipDetails";
import Opportunities from "../pages/admin/Opportunities";
import Users from "../pages/admin/Users";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import Feedback from "../pages/admin/Feedback";
import ProtectedRoute from "./ProtectedRoute";
import { getRoleRoute } from "../utils/roleRoutes";
import AdminLayout from "../Components/AdminLayout";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? getRoleRoute(user.role) : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/weeklylogs" element={<ProtectedRoute requiredRole="student"><WeeklyLogs /></ProtectedRoute>} />
        <Route path="/submitlog" element={<ProtectedRoute requiredRole="student"><SubmitLog /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/supervisor" element={<ProtectedRoute requiredRole="supervisor"><SupervisorDashboard /></ProtectedRoute>} />
        <Route path="/supervisor/assigned-students" element={<ProtectedRoute requiredRole="supervisor"><SupervisorAssignedStudents /></ProtectedRoute>} />
        <Route path="/supervisor/feedback" element={<ProtectedRoute requiredRole="supervisor"><SupervisorFeedback /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>
        <Route path="/student/feedback" element={<ProtectedRoute requiredRole="student"><UserFeedback /></ProtectedRoute>} />
        <Route path="/student/internship-details" element={<ProtectedRoute requiredRole="student"><InternshipDetails /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
