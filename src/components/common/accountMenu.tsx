import type { MouseEvent } from "react";
import { KeyboardArrowDownRounded, LogoutRounded } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import "./accountMenu.css";

interface AccountMenuProps {
  username: string;
  roleLabel: string;
  anchorEl: HTMLButtonElement | null;
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
  onLogout: () => void;
}

const AccountMenu = ({
  username,
  roleLabel,
  anchorEl,
  onOpen,
  onClose,
  onLogout,
}: AccountMenuProps) => (
  <>
    <button
      type="button"
      id="account-menu-button"
      className="account-menu-trigger"
      aria-label={`Abrir menú de ${username}`}
      aria-haspopup="menu"
      aria-expanded={Boolean(anchorEl)}
      aria-controls={anchorEl ? "account-menu" : undefined}
      onClick={onOpen}
    >
      <span className="account-menu-info">
        <strong>{username}</strong>
        <span>{roleLabel}</span>
      </span>
      <span className="account-menu-avatar" aria-hidden="true">
        {username?.slice(0, 1).toUpperCase()}
      </span>
      <KeyboardArrowDownRounded
        className="account-menu-chevron"
        fontSize="small"
      />
    </button>
    <Menu
      id="account-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        list: { "aria-labelledby": "account-menu-button" },
        paper: { className: "account-menu-paper" },
      }}
    >
      <MenuItem onClick={onLogout} className="account-menu-logout">
        <LogoutRounded fontSize="small" />
        Cerrar sesión
      </MenuItem>
    </Menu>
  </>
);

export default AccountMenu;
