import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authstore";
import { allowedToView } from "../utils/allowedToView";

interface RoleGuardProps {
  allowedRoles: readonly string[];
  children?: ReactNode;
}

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasAllowedRole = useAuthStore((state) => allowedToView(allowedRoles, state));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAllowedRole) {
    return <Navigate to="/tickets" replace />;
  }

  return children === undefined ? <Outlet /> : children;
};

export default RoleGuard;
