import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box>
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
