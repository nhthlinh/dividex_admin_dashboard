import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
import type { User } from "../features/users/user.types";

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
      <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user.full_name}</DialogTitle>
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
                  <AvatarFallback className="text-lg bg-rose-100 text-rose-600">
                    {user.full_name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
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

// function UserHistorySection() {
//   return (
//     <div className="grid grid-cols-1 gap-6">
//       {/* Login History */}
//       <HistoryTable
//         title="Login History"
//         headers={["Date & Time", "IP", "Location", "Device"]}
//         rows={loginHistory.map(l => [
//           l.date,
//           l.ip,
//           l.location,
//           l.device,
//         ])}
//       />

//       {/* Activity Log */}
//       <HistoryTable
//         title="Activity Log (Audit)"
//         headers={["Date & Time", "Action", "Status"]}
//         rows={activityLog.map(l => [
//           l.date,
//           l.action,
//           <Badge className="bg-green-100 text-green-700">{l.status}</Badge>,
//         ])}
//       />
//     </div>
//   );
// }

// function UserActions() {
//   return (
//     <div className="flex items-center gap-2">
//       <Button variant="outline" size="sm">
//         <Lock className="size-4 mr-2" /> Lock
//       </Button>

//       <Button variant="outline" size="sm">
//         <UserCog className="size-4 mr-2" /> Assign Role
//       </Button>

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline" size="sm">
//             <MoreVertical className="size-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuItem>
//             <KeyRound className="size-4 mr-2" /> Reset Password
//           </DropdownMenuItem>
//           <DropdownMenuItem className="text-red-600">
//             <Trash2 className="size-4 mr-2" /> Soft Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

// function UserProfileSection({ user }: { user: any }) {
//   return (
//     <div className="border rounded-xl p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div className="flex gap-4">
//           <Avatar className="size-20">
//             <AvatarFallback className="text-lg bg-rose-100 text-rose-600">
//               {user.name.split(" ").map((n: string) => n[0]).join("")}
//             </AvatarFallback>
//           </Avatar>

//           <div>
//             <h3 className="text-lg font-semibold">{user.name}</h3>
//             <p className="text-sm text-slate-500">ID: {user.id}</p>
//             <Badge className="mt-2 bg-green-100 text-green-700">Active</Badge>
//           </div>
//         </div>

//         <UserActions />
//       </div>

//       {/* Info grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
//         {/* Basic Info */}
//         <div className="space-y-3">
//           <h4 className="text-sm font-medium">Basic Information</h4>

//           <InfoRow icon={Mail} label="Email" value={user.email} />
//           <InfoRow icon={Phone} label="Phone" value="+1 (555) 123-4567" />
//           <InfoRow icon={MapPin} label="Location" value="New York, US" />
//           <InfoRow icon={Calendar} label="Joined" value="Jan 15, 2024" />
//         </div>

//         {/* Stats */}
//         <div className="space-y-3">
//           <h4 className="text-sm font-medium">Statistics</h4>

//           <StatRow label="Total Balance" value={user.balance} />
//           <StatRow label="Total Expenses" value="$889.50" />
//           <StatRow label="Groups" value="3" />
//           <StatRow label="Last Login" value="Today, 10:30 AM" />
//         </div>
//       </div>
//     </div>
//   );
// }


