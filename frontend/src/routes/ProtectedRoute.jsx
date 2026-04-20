import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If NOT logged in → go to login
  if (!user) {
    return <Navigate to="/" />;
  }

  // If logged in → show page
  return children;
}

export default ProtectedRoute;