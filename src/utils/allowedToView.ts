import { useAuthStore } from "../store/authstore";

type AuthAccessState = {
  isAuthenticated: boolean;
  user?: { roles?: readonly string[] } | null;
};

export const allowedToView = (
  allowedRoles: readonly string[],
  { isAuthenticated, user }: AuthAccessState = useAuthStore.getState(),
): boolean => {
  if (!isAuthenticated || allowedRoles.length === 0) {
    return false;
  }

  const roles = user?.roles;
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());
  return (
    Array.isArray(roles) &&
    roles.some((role) => normalizedAllowedRoles.includes(role.toLowerCase()))
  );
};
