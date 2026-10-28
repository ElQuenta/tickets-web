import type { ReactNode } from "react";
import { ConfirmationNumberRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./header.css";

type HeaderProps = {
  brandTo?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

const Header = ({ brandTo = "/", children, actions }: HeaderProps) => (
  <header className="app-header">
    <div className="app-header-inner">
      <Link className="app-header-brand" to={brandTo} aria-label="Tickets, inicio">
        <span className="app-header-brand-icon"><ConfirmationNumberRounded fontSize="small" /></span>
        <span>tickets<span className="app-header-brand-dot">.</span></span>
      </Link>
      {children && <div className="app-header-content">{children}</div>}
      {actions && <div className="app-header-actions">{actions}</div>}
    </div>
  </header>
);

export default Header;
