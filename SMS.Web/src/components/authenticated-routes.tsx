import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks";

export const AuthenticatedRoutes = () => {
  const { loggedIn, isLoading } = useAuth();

  return isLoading ? (
    <div>Loading...</div>
  ) : loggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};
