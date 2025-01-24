import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/context";

function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
