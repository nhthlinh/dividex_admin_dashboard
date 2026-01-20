import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-slate-900">Dashboard</h1>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-rose-500" />
            <Input 
              type="search" 
              placeholder="Search here..." 
              className="pl-10 border-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
          </Button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <Avatar className="size-10">
              <AvatarFallback>MU</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm text-slate-900">Muafiq</span>
              <span className="text-xs text-slate-500">Admin</span>
            </div>
            <ChevronDown className="size-4 text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
