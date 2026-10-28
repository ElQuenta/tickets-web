import { useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authstore";
import { ticketPermissions } from "../utils/ticketWorkflow";

export const useAccountMenu = () => {
  const user = useAuthStore((state) => state.user);
  const { isAdmin, canChangeState } = ticketPermissions(user.roles);
  const roleLabel = isAdmin
    ? "Administrador"
    : canChangeState
      ? "Técnico"
      : "Operador";
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const openAccountMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeAccountMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    closeAccountMenu();
    logout();
    navigate("/login", { replace: true });
  };

  return {
    user,
    roleLabel,
    anchorEl,
    openAccountMenu,
    closeAccountMenu,
    handleLogout,
  };
};
