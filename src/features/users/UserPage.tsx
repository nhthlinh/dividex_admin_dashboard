import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Download, Users as UsersIcon, UserCheck, UserPlus } from "lucide-react";
import { UserDetailDialog } from "../../components/UserDetailDialog";
import { Dialog, DialogContent } from "../../components/ui/dialog";

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
  { id: "01", name: "Amy Roo", email: "amy.roo@example.com", balance: "5.3k", popularity: 85 },
  { id: "02", name: "Hana Ghoghly", email: "hana.ghoghly@example.com", balance: "3.3k", popularity: 70 },
  { id: "03", name: "Nguyễn Hồ Thúy Linh", email: "nguyen.linh@example.com", balance: "2.3k", popularity: 60 },
  { id: "04", name: "Nguyễn Hồ Chi Vũ", email: "nguyen.vu@example.com", balance: "1.3k", popularity: 45 },
];

export function UserPage() {
  const [selectedUser, setSelectedUser] = useState<typeof topUsers[0] | null>(null);
  const [isOverviewDialogOpen, setIsOverviewDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUserClick = (user: typeof topUsers[0]) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <Button 
              variant="link" className="text-sm px-0 mt-1"
              onClick={() => setIsOverviewDialogOpen(true)}
            >
              Today's overview
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-sm text-slate-500">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Name</div>
                <div className="col-span-5">Email</div>
                <div className="col-span-2 text-right">Balance</div>
              </div>
              {topUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="col-span-1 text-slate-500">{user.id}</div>
                  <div className="col-span-4 text-slate-900">{user.name}</div>
                  <div className="col-span-5 text-slate-900">{user.email}</div>
                  <div className="col-span-2 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs bg-purple-50 text-purple-600">
                      {user.balance}
                    </span>
                  </div>
                </div>
              ))}
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
          </DialogContent>
        </Dialog>
        )
      }
    </div>
  );
}
