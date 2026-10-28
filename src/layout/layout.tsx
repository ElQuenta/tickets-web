import { ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/common/header";
import AccountMenu from "../components/common/accountMenu";
import { useAccountMenu } from "../hooks/useAccountMenu";
import "./layout.css";

const appTheme = createTheme({
  palette: { primary: { main: "#7051cf" }, error: { main: "#b84d60" } },
  typography: {
    fontFamily: '"Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
});

const Layout = () => {
  const {
    user,
    roleLabel,
    anchorEl,
    openAccountMenu,
    closeAccountMenu,
    handleLogout,
  } = useAccountMenu();
  return (
    <ThemeProvider theme={appTheme}>
      <div className="app-layout">
        <Header
          brandTo="/tickets"
          actions={
            <AccountMenu
              username={user.username}
              roleLabel={roleLabel}
              anchorEl={anchorEl}
              onOpen={openAccountMenu}
              onClose={closeAccountMenu}
              onLogout={handleLogout}
            />
          }
        />
        <main className="app-layout-main">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
