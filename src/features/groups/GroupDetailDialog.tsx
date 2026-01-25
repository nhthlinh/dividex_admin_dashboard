import {
  Users,
  Calendar,
  DollarSign,
  Lock,
  Unlock,
  UserPlus,
  Trash2,
} from "lucide-react";
import type { Group } from "./group.types";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";

interface GroupDetailDialogProps {
  group: Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupDetailDialog({
  group,
  open,
  onOpenChange,
}: GroupDetailDialogProps) {
  if (!group) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Mock members data
  const members = [
    {
      uid: "1",
      name: "Amy Roo",
      email: "amy.roo@example.com",
      role: "Leader",
      joined_at: "2024-01-15",
      avatar_url: {
        public_url: "",
      }
    },
    {
      uid: "2",
      name: "Hana Ghoghly",
      email: "hana.g@example.com",
      role: "Member",
      joined_at: "2024-02-20",
      avatar_url: {
        public_url: "",
      }
    },
    {
      uid: "3",
      name: "Nguyễn Hồ Thúy Linh",
      email: "linh.nguyen@example.com",
      role: "Member",
      joined_at: "2024-03-10",
      avatar_url: {
        public_url: "",
      }
    },
  ];

  // Mock activities
  const activities = [
    {
      id: "1",
      action: "Member joined",
      user: {
        uid: "3",
        full_name: "Nguyễn Hồ Thúy Linh",
        avatar_url: {
          public_url: "",
        }
      },
      timestamp: "2024-03-10 14:30",
    },
    {
      id: "2",
      action: "Payment made",
      user: {
        uid: "1",
        full_name: "Amy Roo",
        avatar_url: {
          public_url: "",
        }
      },
      amount: 150.0,
      timestamp: "2024-03-08 10:15",
    },
    {
      id: "3",
      action: "Event created",
      user: {
        uid: "2",
        full_name: "Hana Ghoghly",
        avatar_url: {
          public_url: "",
        }
      },
      event: "Team Building 2024",
      timestamp: "2024-03-05 16:45",
    },
  ];

  const handleGoToEventPage = () => {
    window.location.href = `/event/group/${group.uid}`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Avatar className="size-7">
                  {group.avatar_url?.public_url ? (
                    <AvatarImage src={group.avatar_url.public_url} />
                  ) : (
                    <AvatarFallback
                      className={`bg-gradient-to-br ${getAvatarGradient(group.uid)} text-white font-semibold`}
                    >
                      {group.name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <DialogTitle className="text-2xl">{group.name}</DialogTitle>
              </div>
              <p className="text-sm text-gray-500 mt-1">Group ID: {group.uid}</p>
            </div>
            <Badge
              variant={group.status === "ACTIVE" ? "default" : "secondary"}
              className={
                group.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {group.status}
            </Badge>
            
          </div>
          <Button size="sm" className="mt-3 bg-rose-600 hover:bg-rose-700 text-white"
            onClick={handleGoToEventPage}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Go to group's events
          </Button>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-2">
        <TabsList className="grid w-full grid-cols-3 gap-4 mb-2">
            <TabsTrigger value="info">
                <div className="text-center">
                    <p className="text-sm font-semibold">Information</p>
                    <p className="text-xs opacity-70">Basic Info & Stats</p>
                </div>
            </TabsTrigger>
            <TabsTrigger value="members">
                <div className="text-center">
                    <p className="text-sm font-semibold">Members</p>
                    <p className="text-xs opacity-70">Group Members List</p>
                </div>
            </TabsTrigger>
            <TabsTrigger value="activity">
                <div className="text-center">
                    <p className="text-sm font-semibold">Activity</p>
                    <p className="text-xs opacity-70">Recent Actions</p>
                </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-xl font-semibold">
                      {group.total_members}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Balance</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(group.total_balance)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Group Leader</p>
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="size-7">
                      {group.leader.avatar_url?.public_url ? (
                        <AvatarImage src={group.leader.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(group.leader.uid)} text-white font-semibold`}
                        >
                          {group.leader.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p className="font-semibold">{group.leader.full_name}</p>
                  </div>
                  {/* <p className="text-sm text-gray-500">{group.leader.email}</p> */}
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created At</p>
                    <p className="text-base font-semibold">
                      {formatDate(group.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold mb-3">Group Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
                {group.status === "ACTIVE" ? (
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Deactivate Group
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Unlock className="h-4 w-4 mr-2" />
                    Activate Group
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Group
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.uid}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="size-7">
                      {member.avatar_url?.public_url ? (
                        <AvatarImage src={member.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(member.uid)} text-white font-semibold`}
                        >
                          {member.name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{member.role}</Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Joined {formatDate(member.joined_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="flex gap-2 items-center text-sm text-gray-600 mt-1">
                      by
                      <Avatar className="size-7">
                        {activity.user.avatar_url?.public_url ? (
                          <AvatarImage src={activity.user.avatar_url.public_url} />
                        ) : (
                          <AvatarFallback
                            className={`bg-gradient-to-br ${getAvatarGradient(activity.user.uid)} text-white font-semibold`}
                          >
                            {activity.user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium">{activity.user.full_name}</span>
                      {activity.amount && (
                        <span> - {formatCurrency(activity.amount)}</span>
                      )}
                      {activity.event && (
                        <span> - {activity.event}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
