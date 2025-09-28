import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

type Role = "admin" | "doctor" | "reception";

interface RoleRouteProps {
  roles: Role[];
  children: React.ReactNode;
}

export function Private({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export function RoleRoute({ roles, children }: RoleRouteProps) {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}