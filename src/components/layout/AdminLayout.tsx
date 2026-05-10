import { Sidebar } from '../Sidebar'
import { useEffect, useState } from 'react'
import { Header } from '../Header'
import { Outlet } from 'react-router-dom'
import { authStore } from '../../features/auth/auth.store'

export default function AdminLayout() {
  const url = window.location.pathname

  const [currentPage, setCurrentPage] = useState(
    url === '/' ? 'dashboard' : url.substring(1)
  )

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const userInfo = authStore.getUserInfo()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')

    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)

      if (!event.matches) {
        setIsMobileSidebarOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleMediaChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    setIsMobileSidebarOpen(false)

    switch (page) {
      case 'dashboard':
        window.location.href = '/'
        break

      case 'user':
        window.location.href = '/user'
        break

      case 'group':
        window.location.href = '/group'
        break

      case 'event':
        window.location.href = '/event'
        break

      case 'expense':
        window.location.href = '/expense'
        break

      case 'transaction':
        window.location.href = '/transaction'
        break

      case 'notification':
        window.location.href = '/notification'
        break

      case 'message':
        window.location.href = '/message'
        break

      case 'admin':
        if (userInfo?.role === 'SUPERUSER') {
          window.location.href = '/admin'
        }
        break

      case 'system-logs':
        window.location.href = '/system-logs'
        break

      case 'settings':
        window.location.href = '/settings'
        break

      default:
        window.location.href = '/'
    }
  }

  return (
    <div
      data-testid="admin-layout"
      className="relative flex min-h-screen bg-slate-50 overflow-x-hidden md:h-screen md:overflow-hidden"
    >
      {isMobile ? (
        <>
          {isMobileSidebarOpen && (
            <button
              aria-label="Close sidebar"
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          <div
            className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:hidden ${
              isMobileSidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full'
            }`}
          >
            <Sidebar
              data-testid="admin-nav"
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
          </div>
        </>
      ) : (
        <Sidebar
          data-testid="admin-nav"
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}

      <div className="min-w-0 flex-1 overflow-x-auto overflow-y-auto flex flex-col">
        <Header
          data-testid="admin-header"
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main data-testid="admin-main" className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}