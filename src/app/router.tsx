import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { UserPage } from "../features/dashboard/UserPage";
import { AdminManagementPage } from "../features/auth/AdminManagementPage";
import { AdminInviteAcceptPage } from "../features/auth/AdminInviteAcceptPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },

  {
    path: "/admin/invite",
    element: <AdminInviteAcceptPage />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "user", element: <UserPage /> },
      { path: "admin", element: <AdminManagementPage /> },
    ],
  },
]);
