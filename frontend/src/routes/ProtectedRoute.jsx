import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  // If NOT logged in → go to login
  if (!user) {
    return <Navigate to="/" />;
  }

  // If role is required and user doesn't have it → go to their default dashboard
  if (requiredRole && user.role !== requiredRole) {
    const roleRoutes = {
      admin: "/admin",
      supervisor: "/supervisor",
      student: "/student",
    };
    return <Navigate to={roleRoutes[user.role]} />;
  }

  // If logged in and authorized → show page
  return children;
}

export default ProtectedRoute;