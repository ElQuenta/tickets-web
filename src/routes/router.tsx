import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "../guards/authGuard";
import RoleProtectedRoutes from "../guards/roleGuard";
import { lazy } from "react";
import Layout from "../layout/layout";

const LoginPage = lazy(() => import("../pages/loginPage"));
const TicketBoardPage = lazy(() => import("../pages/ticketboardPage"));
const UserBoardPage = lazy(() => import("../pages/userBoardPage"));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Layout />
            </ProtectedRoutes>
          }
        >
          <Route path="tickets" element={<TicketBoardPage />} />
          <Route
            path="/"
            element={<RoleProtectedRoutes allowedRoles={["admin"]} />}
          >
            <Route path="/dashboard" element={<UserBoardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/tickets" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
