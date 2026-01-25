import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { UserPage } from "../features/users/UserPage";
import { AdminManagementPage } from "../features/admins/AdminManagementPage";
import { AdminInviteAcceptPage } from "../features/admins/AdminInviteAcceptPage";
import { GroupPage } from "../features/groups/GroupPage";
import { EventPage } from "../features/events/EventPage";
import { ExpensePage } from "../features/expenses/ExpensePage";
import { TransactionPage } from "../features/transactions/TransactionPage";
import { NotificationPage } from "../features/notifications/NotificationPage";
import { MessagePage } from "../features/messages/MessagePage";
import { EventInGroupPage } from "../features/events/EventInGroupPage";
import { ExpenseInEventPage } from "../features/expenses/ExpenseInEventPage";

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
      { path: "group", element: <GroupPage /> },
      { path: "event", element: <EventPage /> },
      { path: "event/group/:group_uid", element: <EventInGroupPage /> },
      { path: "expense", element: <ExpensePage /> },
      { path: "expense/event/:event_uid", element: <ExpenseInEventPage /> },
      { path: "transaction", element: <TransactionPage /> },
      { path: "notification", element: <NotificationPage />},
      { path: "message", element: <MessagePage />}
    ],
  },
]);
