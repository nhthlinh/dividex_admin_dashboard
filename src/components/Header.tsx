import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { authStore } from "../features/auth/auth.store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-slate-900">Dashboard</h1>

        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
          </Button> */}

          <AdminUserMenu />
        </div>
      </div>
    </header>
  );
}

function AdminUserMenu() {
  const user = authStore.getUserInfo();

  if (!user) return null; 

  const displayName = user.full_name || user.email;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const gradient = getAvatarGradient(user.uid);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-md">
          <Avatar className="size-10">
            {user.avatar_url?.public_url ? (
              <AvatarImage src={user.avatar_url.public_url} />
            ) : (
              <AvatarFallback
                className={`bg-gradient-to-br ${gradient} text-white font-semibold`}
              >
                {initials}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-slate-900">
              {displayName}
            </span>
            <span className="text-xs text-slate-500 capitalize">
              {user.role?.toLowerCase() ?? "Super Admin"}
            </span>
          </div>

          <ChevronDown className="size-4 text-slate-600" />
        </div>
      </DropdownMenuTrigger>

      {/* <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}

export const getAvatarGradient = (uid: string) => {
  const gradients = [
    "from-rose-500 to-pink-500",
    "from-indigo-500 to-purple-500",
    "from-sky-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
  ];

  const index =
    uid.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    gradients.length;

  return gradients[index];
};
