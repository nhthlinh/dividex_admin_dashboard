import { Sidebar } from '../Sidebar'
import { useState } from 'react'
import { Header } from '../Header'
import { Outlet } from 'react-router-dom'


export default function AdminLayout() {
  const url = window.location.pathname;
  const [currentPage, setCurrentPage] = useState(url === "/" ? "dashboard" : url.substring(1));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={(page) => {
        setCurrentPage(page);
        switch (page) {
          case "dashboard":
            window.location.href = "/";
            break;
          case "user":
            window.location.href = "/user";
            break;
          case "admin":
            window.location.href = "/admin";
            break;
          default:
            window.location.href = "/";
        }
      }} />
      
      <div className="flex-1 overflow-x-auto flex flex-col">
        <Header />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    
      
    </div>
  )
}
