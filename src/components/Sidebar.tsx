import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Calendar,
  TrendingDown,
  CreditCard,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  PlusSquare,
} from "lucide-react";
import { Button } from "./ui/button";
import { authStore } from "../features/auth/auth.store";
import { router } from "../app/router";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: Users, label: "User", key: "user" },
  { icon: ShoppingCart, label: "Group", key: "group" },
  { icon: Calendar, label: "Event", key: "event" },
  { icon: TrendingDown, label: "Expense", key: "expense" },
  { icon: CreditCard, label: "Transaction", key: "transaction" },
  { icon: Bell, label: "Notification", key: "notification" },
  { icon: MessageSquare, label: "Message", key: "message" },
  { icon: PlusSquare, label: "Admin", key: "admin" },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    authStore.logout(); // clear token + user
    window.location.href = "/login";
  };

  return (
    <aside
      className={`
        bg-white border-r border-slate-200
        flex flex-col transition-all duration-300
        ${collapsed ? "w-[60px]" : "w-[200px]"}
        hidden md:flex
      `}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <span className="font-semibold">Dividex</span>}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="size-4" />
        </Button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const pathname = router.state.location.pathname;
          const routeKey = pathname.split("/")[1]; // an toàn hơn slice(1)
          console.log("Current routeKey:", routeKey, "Item key:", item.key);

          const isActive = routeKey === item.key;

          console.log("isActive for", item.key, ":", isActive);

          return (
            <Button
              key={item.key}
              variant={isActive ? "default" : "ghost"}
              className={`w-full mb-1 ${
                collapsed ? "justify-center" : "justify-start"
              } ${
                isActive
                  ? "bg-gradient-to-r from-rose-700 to-rose-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => onNavigate(item.key)}
            >
              <Icon className="size-4" />
              {!collapsed && (
                <span className="ml-3 text-sm">{item.label}</span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className={`w-full ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          <Settings className="size-4" />
          {!collapsed && <span className="ml-3">Settings</span>}
        </Button>

        <Button
          variant="ghost"
          className={`w-full ${
            collapsed ? "justify-center" : "justify-start"
          }`}
          onClick={handleLogout}
        >
          <LogOut className="size-4 text-red-600" />
          {!collapsed && <span className="ml-3 text-red-600">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
