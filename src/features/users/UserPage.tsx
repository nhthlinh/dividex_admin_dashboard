import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Users as UsersIcon, UserCheck, UserPlus, Search } from "lucide-react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import type { User, UserDetail } from "./user.types";
import { UserAPI } from "./user.api";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";
import { UserDetailDialog } from "./UserDetailDialog";
import { Input } from "../../components/ui/input";

const userStats = [
  {
    icon: UsersIcon,
    label: "Total User",
    value: "300",
    change: "+8% from yesterday",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    icon: UserCheck,
    label: "Total Active User",
    value: "300",
    change: "+5% from yesterday",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: UserPlus,
    label: "New User",
    value: "8",
    change: "0.5% from yesterday",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

const PAGE_SIZE = 2;

export function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isOverviewDialogOpen, setIsOverviewDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const handleUserClick = async (user: User) => {
    await UserAPI.getUserDetail(user.uid).then(setSelectedUser);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await UserAPI.listUsers({
        page,
        page_size: PAGE_SIZE,
        order_by: "full_name",
        sort_type: "desc",
        search: inputValue,
      });

      setUsers(res.content);
      setTotal(res.total_rows);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all users
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-rose-500" 
                  onClick={fetchUsers}
                />
                <Input 
                  type="search" 
                  placeholder="Search here..." 
                  className="pl-10 border-slate-200"
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </div>
            <Button 
              variant="link" className="text-sm px-0 mt-1"
              onClick={() => setIsOverviewDialogOpen(true)}
            >
              Today's overview
            </Button>
          </CardHeader>
          <CardContent>
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-sm text-slate-500">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Name</div>
              <div className="col-span-5">Email</div>
              <div className="col-span-2 text-right">Balance</div>
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {loading ? (
                <div className="py-10 text-center text-slate-500">
                  Loading users...
                </div>
              ) : (
                users.map((user, index) => (
                  <div
                    key={user.uid}
                    className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="col-span-1 text-slate-500">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </div>

                    <div className="col-span-4 text-slate-900 flex items-center gap-3">
                      <Avatar className="size-7">
                        {user.avatar_url?.public_url ? (
                          <AvatarImage src={user.avatar_url.public_url} />
                        ) : (
                          <AvatarFallback
                            className={`bg-gradient-to-br ${getAvatarGradient(user.uid)} text-white font-semibold`}
                          >
                            {user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {user.full_name}
                    </div>

                    <div className="col-span-5 text-slate-500">
                      {user.email}
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs bg-purple-50 text-purple-600">
                        {user.balance?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-slate-500">
                Page {page} / {totalPages || 1}
              </span>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Detail Dialog */}
      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}

      {/* Overview Dialog */}
      {isOverviewDialogOpen && (
        <Dialog open={isOverviewDialogOpen} onOpenChange={() => setIsOverviewDialogOpen(false)}>
          <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Today's Overview</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Summary</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className={`${stat.bgColor} rounded-xl p-4`}
                      >
                        <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                          <Icon className={`size-5 ${stat.iconColor}`} />
                        </div>
                        <div className="text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                        <div className="text-xs text-blue-600">{stat.change}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
        )
      }
    </div>
  );
}
