import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '../features/auth/LoginPage'
import AdminLayout from '../components/layout/AdminLayout'
import ProtectedRoute from '../components/layout/ProtectedRoute'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { UserPage } from '../components/UserPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },

  {
    path: '/user',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <UserPage />}],
  }

])
