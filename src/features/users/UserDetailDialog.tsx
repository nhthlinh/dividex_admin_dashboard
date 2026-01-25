import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Lock,
  Unlock,
  Trash2,
  KeyRound,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import type { User } from "./user.types";
import { getAvatarGradient } from "../../components/Header";

interface UserDetailDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const loginHistory = [
  { date: "2024-11-18 10:30 AM", ip: "192.168.1.1", location: "New York, US", device: "Chrome on Windows" },
  { date: "2024-11-17 02:15 PM", ip: "192.168.1.2", location: "New York, US", device: "Safari on iPhone" },
  { date: "2024-11-16 09:45 AM", ip: "192.168.1.1", location: "New York, US", device: "Chrome on Windows" },
];

const activityLog = [
  { date: "2024-11-18 11:00 AM", action: "Updated profile information", status: "success" },
  { date: "2024-11-18 10:30 AM", action: "Logged in", status: "success" },
  { date: "2024-11-17 03:20 PM", action: "Created new expense", status: "success" },
  { date: "2024-11-17 02:15 PM", action: "Logged in", status: "success" },
];

const participatingGroups = [
  { name: "Marketing Team", role: "Member", joinedDate: "2024-01-15" },
  { name: "Design Department", role: "Admin", joinedDate: "2024-02-20" },
  { name: "Project Alpha", role: "Member", joinedDate: "2024-03-10" },
];

const createdExpenses = [
  { title: "Office Supplies", amount: "$234.50", date: "2024-11-15", status: "Approved" },
  { title: "Team Lunch", amount: "$156.00", date: "2024-11-10", status: "Pending" },
  { title: "Software License", amount: "$499.00", date: "2024-11-05", status: "Approved" },
];

export function UserDetailDialog({ user, isOpen, onClose }: UserDetailDialogProps) {
  const [isLocked, setIsLocked] = useState(false);

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    console.log(`User ${isLocked ? "unlocked" : "locked"}`);
  };

  const handleSoftDelete = () => {
    console.log("Soft delete user");
  };

  const handleResetPassword = () => {
    console.log("Reset password");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl min-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-row gap-2 items-center">
            <Avatar className="size-10">
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
            <DialogTitle>{user.full_name}</DialogTitle>
          </div>
          
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full border-b pb-4">
          <TabsList className="grid w-full grid-cols-3 gap-4 mb-8">
            <TabsTrigger value="profile">
              <div className="text-center">
                <p className="text-sm font-semibold">Profile</p>
                <p className="text-xs opacity-70">Basic Info & Stats</p>
              </div>
            </TabsTrigger>
            <TabsTrigger value="history">
              <div className="text-center">
                <p className="text-sm font-semibold">History</p>
                <p className="text-xs opacity-70">Login & Activity</p>
              </div>
            </TabsTrigger>
            <TabsTrigger value="relationship" className="text-center">
              <div className="text-center">
                <p className="text-sm font-semibold">Relationship</p>
                <p className="text-xs opacity-70">Groups & Expenses</p>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="size-20">
                  {user.avatar_url?.public_url ? (
                    <AvatarImage src={user.avatar_url.public_url} />
                  ) : (
                    <AvatarFallback
                      className={`bg-gradient-to-br ${getAvatarGradient(user.uid)} text-white font-semibold`}
                    >
                      {user.full_name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-slate-900">{user.full_name}</h3>
                  <p className="text-sm text-slate-500">ID: {user.uid}</p>
                  <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-200">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLockToggle}
                  className={`${isLocked ? "bg-red-50 text-red-600 hover:bg-red-100" : ""}`}
                >
                  {isLocked ? (
                    <>
                      <Unlock className="size-4 mr-2" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="size-4 mr-2" />
                      Lock
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleResetPassword}>
                      <KeyRound className="size-4 mr-2" />
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSoftDelete} className="text-red-600">
                      <Trash2 className="size-4 mr-2" />
                      Soft Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-4">
                <h4 className="text-sm text-slate-900">Basic Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="size-4 text-slate-400" />
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-900">{user.email || "amy.roo@example.com"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="size-4 text-slate-400" />
                    <span className="text-slate-500">Phone:</span>
                    <span className="text-slate-900">{user.phone_number || ""}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="size-4 text-slate-400" />
                    <span className="text-slate-500">Role:</span>
                    <span className="text-slate-900">{user.role || ""}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm"> 
                    <Calendar className="size-4 text-slate-400" />
                    <span className="text-slate-500">Joined:</span>
                    <span className="text-slate-900"></span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm text-slate-900">Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Balance:</span>
                    <span className="text-slate-900">{user.balance?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Expenses:</span>
                    <span className="text-slate-900"></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Groups:</span>
                    <span className="text-slate-900"></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Last Login:</span>
                    <span className="text-slate-900"></span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div>
              <h4 className="text-sm text-slate-900 mb-3">Login History</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Date & Time</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">IP Address</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Location</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.map((log, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 text-sm text-slate-900">{log.date}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{log.ip}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{log.location}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{log.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-slate-900 mb-3">Activity Log (Audit Log)</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Date & Time</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Action</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLog.map((log, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 text-sm text-slate-900">{log.date}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{log.action}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-700">
                            {log.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Relationship Tab */}
          <TabsContent value="relationship" className="space-y-6">
            <div>
              <h4 className="text-sm text-slate-900 mb-3">Participating Groups</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Group Name</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Role</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participatingGroups.map((group, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 text-sm text-slate-900">{group.name}</td>
                        <td className="px-4 py-3">
                          <Badge variant={group.role === "Admin" ? "default" : "secondary"}>
                            {group.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{group.joinedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-slate-900 mb-3">Created Expenses</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Title</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Amount</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Date</th>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createdExpenses.map((expense, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 text-sm text-slate-900">{expense.title}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{expense.amount}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{expense.date}</td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              expense.status === "Approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {expense.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
    // <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto space-y-6">
    //   <DialogHeader>
    //     <DialogTitle>User Details</DialogTitle>
    //   </DialogHeader>

    //   {/* TOP: USER INFO */}
    //   <UserProfileSection user={user} />

    //   {/* BOTTOM: HISTORY */}
    //   <UserHistorySection />
    // </DialogContent>

  );
}

