import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Bell,
  BellRing,
  Send,
  Search,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  Trash2,
  Megaphone,
} from "lucide-react";
import type { Notification, NotificationType } from "./notification.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";

const notificationStats = [
  {
    icon: Bell,
    label: "Total Notifications",
    value: "2,456",
    change: "+18% from last month",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: BellRing,
    label: "Active Notifications",
    value: "1,234",
    change: "+12% from last month",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Users,
    label: "Total Recipients",
    value: "8,945",
    change: "+25% from last month",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    icon: Send,
    label: "Sent Today",
    value: "156",
    change: "+8% from yesterday",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-500",
  },
];

const mockNotifications: Notification[] = [
  {
    uid: "notif-001",
    from_user: {
      uid: "admin-001",
      full_name: "System Admin",
      email: "admin@dividex.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    content: "New event 'Team Building 2024' has been created. Check it out!",
    type: "EVENT",
    related_uid: "evt-001",
    to_users: [
      {
        uid: "usr-001", full_name: "Amy Roo", email: "amy.roo@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-002", full_name: "Hana Ghoghly", email: "hana.g@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
    ],
    created_at: "2024-03-15T10:30:00Z",
    is_broadcast: false,
  },
  {
    uid: "notif-002",
    from_user: {
      uid: "admin-001",
      full_name: "System Admin",
      email: "admin@dividex.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    content:
      "System maintenance scheduled for tomorrow at 2:00 AM. Expected downtime: 2 hours.",
    type: "SYSTEM",
    to_users: [
      {
        uid: "usr-001", full_name: "Amy Roo", email: "amy.roo@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-002", full_name: "Hana Ghoghly", email: "hana.g@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-003", full_name: "Nguyễn Hồ Thúy Linh", email: "linh.nguyen@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-004", full_name: "John Smith", email: "john.smith@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
    ],
    created_at: "2024-03-16T09:00:00Z",
    is_broadcast: true,
  },
  {
    uid: "notif-003",
    from_user: {
      uid: "usr-002",
      full_name: "Hana Ghoghly",
      email: "hana.g@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    content: "You have been added to expense 'Team Dinner at Restaurant'",
    type: "EXPENSE",
    related_uid: "exp-001",
    to_users: [
      {
        uid: "usr-001", full_name: "Amy Roo", email: "amy.roo@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-003", full_name: "Nguyễn Hồ Thúy Linh", email: "linh.nguyen@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
    ],
    created_at: "2024-03-17T14:20:00Z",
    is_broadcast: false,
  },
  {
    uid: "notif-004",
    from_user: {
      uid: "admin-001",
      full_name: "System Admin",
      email: "admin@dividex.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    content: "Payment settlement for Event 'Marketing Campaign Launch' is complete",
    type: "PAYMENT",
    related_uid: "evt-002",
    to_users: [
      {
        uid: "usr-002", full_name: "Hana Ghoghly", email: "hana.g@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
    ],
    created_at: "2024-03-18T11:45:00Z",
    is_broadcast: false,
  },
  {
    uid: "notif-005",
    from_user: {
      uid: "admin-001",
      full_name: "System Admin",
      email: "admin@dividex.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    content:
      "Welcome to Dividex! Complete your profile to get started with expense sharing.",
    type: "ANNOUNCEMENT",
    to_users: [
      {
        uid: "usr-001", full_name: "Amy Roo", email: "amy.roo@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-002", full_name: "Hana Ghoghly", email: "hana.g@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-003", full_name: "Nguyễn Hồ Thúy Linh", email: "linh.nguyen@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
    ],
    created_at: "2024-03-10T08:00:00Z",
    is_broadcast: true,
  },
  {
    uid: "notif-006",
    from_user: {
      uid: "usr-003",
      full_name: "Nguyễn Hồ Thúy Linh",
      email: "linh.nguyen@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    content: "You have been added to group 'Weekend Trip Planning'",
    type: "GROUP",
    related_uid: "grp-003",
    to_users: [
      {
        uid: "usr-001", full_name: "Amy Roo", email: "amy.roo@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-004", full_name: "John Smith", email: "john.smith@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
    ],
    created_at: "2024-03-19T16:30:00Z",
    is_broadcast: false,
  },
  {
    uid: "notif-007",
    from_user: {
      uid: "admin-001",
      full_name: "System Admin",
      email: "admin@dividex.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    content:
      "Reminder: Event 'Team Building 2024' starts tomorrow. Don't forget to check your expenses!",
    type: "REMINDER",
    related_uid: "evt-001",
    to_users: [
      {
        uid: "usr-001", full_name: "Amy Roo", email: "amy.roo@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-002", full_name: "Hana Ghoghly", email: "hana.g@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-003", full_name: "Nguyễn Hồ Thúy Linh", email: "linh.nguyen@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
    ],
    created_at: "2024-03-20T09:00:00Z",
    is_broadcast: false,
  },
];

// Mock users for selecting recipients
const mockUsers = [
  { uid: "usr-001", name: "Amy Roo", email: "amy.roo@example.com" },
  { uid: "usr-002", name: "Hana Ghoghly", email: "hana.g@example.com" },
  { uid: "usr-003", name: "Nguyễn Hồ Thúy Linh", email: "linh.nguyen@example.com" },
  { uid: "usr-004", name: "John Smith", email: "john.smith@example.com" },
  { uid: "usr-005", name: "Nguyễn Hồ Chi Vũ", email: "vu.nguyen@example.com" },
];

export function NotificationPage() {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Create notification form state
  const [newNotification, setNewNotification] = useState({
    content: "",
    type: "ANNOUNCEMENT" as NotificationType,
    isBroadcast: false,
    selectedUsers: [] as string[],
  });

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailDialogOpen(true);
  };

  const handleCreateNotification = () => {
    alert(
      `Notification sent to ${
        newNotification.isBroadcast
          ? "all users"
          : `${newNotification.selectedUsers.length} users`
      }`
    );
    setIsCreateDialogOpen(false);
    setNewNotification({
      content: "",
      type: "ANNOUNCEMENT",
      isBroadcast: false,
      selectedUsers: [],
    });
  };

  const handleDeleteNotification = (notification: Notification) => {
    alert(`Deleted notification: ${notification.uid}`);
    setIsDetailDialogOpen(false);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      SYSTEM: "bg-blue-100 text-blue-800",
      EVENT: "bg-purple-100 text-purple-800",
      EXPENSE: "bg-orange-100 text-orange-800",
      PAYMENT: "bg-green-100 text-green-800",
      GROUP: "bg-rose-100 text-rose-800",
      MESSAGE: "bg-indigo-100 text-indigo-800",
      ANNOUNCEMENT: "bg-yellow-100 text-yellow-800",
      REMINDER: "bg-red-100 text-red-800",
      WARNING: "bg-red-100 text-red-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const toggleUserSelection = (uid: string) => {
    setNewNotification((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(uid)
        ? prev.selectedUsers.filter((u) => u !== uid)
        : [...prev.selectedUsers, uid],
    }));
  };

  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch = notification.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "ALL" || notification.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notification Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Send and manage notifications to users
          </p>
        </div>
        <Button
          size="sm"
          className="bg-rose-600 hover:bg-rose-700 text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {notificationStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Notifications</CardTitle>
            <div className="flex gap-3 flex-1 justify-end">
              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="SYSTEM">System</option>
                <option value="EVENT">Event</option>
                <option value="EXPENSE">Expense</option>
                <option value="PAYMENT">Payment</option>
                <option value="GROUP">Group</option>
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="REMINDER">Reminder</option>
                <option value="WARNING">Warning</option>
              </select>

              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.uid}
                className="cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-rose-200"
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                        {notification.is_broadcast ? (
                          <Megaphone className="h-6 w-6 text-purple-600" />
                        ) : (
                          <Bell className="h-6 w-6 text-blue-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className={getTypeColor(notification.type)}
                          >
                            {notification.type}
                          </Badge>
                          {notification.is_broadcast && (
                            <Badge
                              variant="secondary"
                              className="bg-purple-100 text-purple-700"
                            >
                              <Megaphone className="h-3 w-3 mr-1" />
                              Broadcast
                            </Badge>
                          )}
                        </div>
                        <p className="font-semibold mb-2">
                          {notification.content}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <div className="flex flex-row items-center gap-3">
                              <Avatar className="size-7">
                                {notification.from_user.avatar_url?.public_url ? (
                                  <AvatarImage src={notification.from_user.avatar_url.public_url} />
                                ) : (
                                  <AvatarFallback
                                    className={`bg-gradient-to-br ${getAvatarGradient(notification.from_user.uid)} text-white font-semibold`}
                                  >
                                    {notification.from_user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <span>
                                From: {notification.from_user.full_name}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{notification.to_users.length} recipients</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDateTime(notification.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Detail Dialog */}
      {selectedNotification && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Notification Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    {selectedNotification.is_broadcast ? (
                      <Megaphone className="h-6 w-6 text-purple-600" />
                    ) : (
                      <Bell className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className={getTypeColor(selectedNotification.type)}
                      >
                        {selectedNotification.type}
                      </Badge>
                      {selectedNotification.is_broadcast && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-700"
                        >
                          <Megaphone className="h-3 w-3 mr-1" />
                          Broadcast
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg font-semibold">
                      {selectedNotification.content}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Sent By</p>
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="size-8">
                      {selectedNotification.from_user.avatar_url?.public_url ? (
                        <AvatarImage src={selectedNotification.from_user.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(selectedNotification.from_user.uid)} text-white font-semibold`}
                        >
                          {selectedNotification.from_user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p className="font-medium text-sm">
                      {selectedNotification.from_user.full_name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {selectedNotification.from_user.email}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Sent At</p>
                  <p className="font-semibold">
                    {formatDateTime(selectedNotification.created_at)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  Recipients ({selectedNotification.to_users.length})
                </p>
                <div className="space-y-2">
                  {selectedNotification.to_users.map((user) => (
                    <div
                      key={user.uid}
                      className="flex items-center gap-3 p-2 bg-white rounded"
                    >
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
                      <div>
                        <p className="font-medium text-sm">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedNotification.related_uid && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Related Item</p>
                  <p className="font-semibold">
                    ID: {selectedNotification.related_uid}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => handleDeleteNotification(selectedNotification)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Notification Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Notification</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Notification Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={newNotification.type}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    type: e.target.value as NotificationType,
                  })
                }
              >
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="SYSTEM">System</option>
                <option value="EVENT">Event</option>
                <option value="EXPENSE">Expense</option>
                <option value="PAYMENT">Payment</option>
                <option value="GROUP">Group</option>
                <option value="REMINDER">Reminder</option>
                <option value="WARNING">Warning</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                placeholder="Enter notification message..."
                rows={4}
                value={newNotification.content}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    content: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg">
              <input
                type="checkbox"
                id="broadcast"
                checked={newNotification.isBroadcast}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    isBroadcast: e.target.checked,
                    selectedUsers: e.target.checked ? [] : newNotification.selectedUsers,
                  })
                }
                className="h-4 w-4"
              />
              <label htmlFor="broadcast" className="text-sm font-medium cursor-pointer">
                <Megaphone className="h-4 w-4 inline mr-2" />
                Broadcast to all users
              </label>
            </div>

            {!newNotification.isBroadcast && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Recipients
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {mockUsers.map((user) => (
                      <div
                        key={user.uid}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                          newNotification.selectedUsers.includes(user.uid)
                            ? "bg-rose-50 border border-rose-200"
                            : ""
                        }`}
                        onClick={() => toggleUserSelection(user.uid)}
                      >
                        <input
                          type="checkbox"
                          checked={newNotification.selectedUsers.includes(
                            user.uid
                          )}
                          onChange={() => toggleUserSelection(user.uid)}
                          className="h-4 w-4"
                        />
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {newNotification.selectedUsers.length} user(s) selected
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNotification}
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={
                !newNotification.content ||
                (!newNotification.isBroadcast &&
                  newNotification.selectedUsers.length === 0)
              }
            >
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}