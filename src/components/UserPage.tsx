import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Users as UsersIcon, UserCheck, UserPlus } from "lucide-react";
import { UserDetailDialog } from "./UserDetailDialog";

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

const topUsers = [
  { id: "01", name: "Amy Roo", email: "", sales: "5.3k", popularity: 85 },
  { id: "02", name: "Hana Ghoghly", email: "", sales: "3.3k", popularity: 70 },
  { id: "03", name: "Nguyễn Hồ Thúy Linh", email: "", sales: "2.3k", popularity: 60 },
  { id: "04", name: "Nguyễn Hồ Chi Vũ", email: "", sales: "1.3k", popularity: 45 },
];

const getPopularityColor = (popularity: number) => {
  if (popularity >= 80) return "bg-blue-500";
  if (popularity >= 60) return "bg-green-500";
  if (popularity >= 40) return "bg-purple-500";
  return "bg-orange-500";
};

export function UserPage() {
  const [selectedUser, setSelectedUser] = useState<typeof topUsers[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUserClick = (user: typeof topUsers[0]) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Overview</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Summery</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="size-4 mr-2" />
                Export
              </Button>
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

          {/* Top User */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Top User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-slate-500">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Name</div>
                  <div className="col-span-5">Popularity</div>
                  <div className="col-span-2 text-right">Sales</div>
                </div>
                {topUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="col-span-1 text-slate-500">{user.id}</div>
                    <div className="col-span-4 text-slate-900">{user.name}</div>
                    <div className="col-span-5">
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${getPopularityColor(user.popularity)}`}
                          style={{ width: `${user.popularity}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs bg-purple-50 text-purple-600">
                        {user.sales}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User's Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User's Overview</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Summery</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2"></div>
                    <p className="text-sm text-slate-700">
                      <span className="text-slate-900">Profile:</span> Basic Information.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2"></div>
                    <p className="text-sm text-slate-700">
                      <span className="text-slate-900">"History" tab:</span> Login history, Activity (Audit Log).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2"></div>
                    <p className="text-sm text-slate-700">
                      <span className="text-slate-900">"Relationship" tab:</span> List of participating groups, List of created expenses.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2"></div>
                    <p className="text-sm text-slate-700">
                      <span className="text-slate-900">Action buttons:</span> Lock/Unlock, Assign Role, Soft Delete, Reset Password (dropdown menu "...").
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Detail Dialog */}
      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}
