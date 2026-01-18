import { LayoutDashboard, Users, ShoppingCart, Calendar, TrendingDown, CreditCard, Bell, MessageSquare, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";

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
  { icon: CreditCard, label: "Payment & Settlement", key: "payment" },
  { icon: Bell, label: "Notification", key: "notification" },
  { icon: MessageSquare, label: "Messages", key: "messages" },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-700 rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <span className="text-slate-900">Dividex</span>
        </div>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.key;
          return (
            <Button
              key={item.key}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start mb-1 ${
                isActive 
                  ? "bg-gradient-to-r from-rose-700 to-rose-600 text-white hover:from-rose-800 hover:to-rose-700" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
              onClick={() => {
                onNavigate(item.key);
              }}
            >
              <Icon className="size-4 mr-3" />
              <span className="text-sm">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
          <Settings className="size-4 mr-3" />
          <span className="text-sm">Settings</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
          <LogOut className="size-4 mr-3" />
          <span className="text-sm">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
