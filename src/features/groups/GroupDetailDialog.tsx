import {
  Users,
  Calendar,
  Unlock,
  Trash2,
  Activity,
} from "lucide-react";
import type { GroupActivity, GroupItem, GroupMember } from "./group.types";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";
import { GroupAPI } from "./group.api";

interface GroupDetailDialogProps {
  group: GroupItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { useEffect, useState } from "react";
import { CardContent } from "../../components/ui/card";
import { Spin } from "antd";

export function GroupDetailDialog({ group, open, onOpenChange }: GroupDetailDialogProps) {
  const [localGroup, setLocalGroup] = useState<GroupItem | null>(group);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [activities, setActivities] = useState<GroupActivity[]>([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLocalGroup(group);
  }, [group]);

  useEffect(() => {
    if (!localGroup) return;
    const fetchMembers = async () => {
      try {
        const res = await GroupAPI.getGroupMembers(localGroup.uid, {
          page_size: 100,
        });
        setMembers(res.content);
      } catch (error) {
        console.error("Failed to fetch group members:", error);
      }
    };

    const fetchActivities = async () => {
      if (!localGroup) return;
      try {
        const res = await GroupAPI.getGroupActivity(localGroup.uid, page, 10);
        setActivities(res.content);
        setTotalPages(res.total_pages);
      } catch (error) {
        console.error("Failed to fetch group activities:", error);
      }
    };

    if (localGroup) {
      fetchMembers();
      fetchActivities();
    } 
  }, [localGroup]);

  useEffect(() => {
    if (localGroup) {
      const fetchActivities = async () => {
        setLoading(true);
        try {
          const res = await GroupAPI.getGroupActivity(localGroup.uid, page, 10);
          setActivities(res.content);
          setTotalPages(res.total_pages);
        } catch (error) {
          console.error("Failed to fetch group activities:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchActivities();
    }   
  }, [page]);

  if (!localGroup) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleGoToEventPage = () => {
    window.location.href = `/event/group/${localGroup.uid}`;
  }

  const handleDeactivateGroup = async () => {
    try {
      setLocalGroup(prev =>
        prev ? { ...prev, status: "INACTIVE" } : prev
      );

      await GroupAPI.deactivateGroup(localGroup.uid);
    } catch (error) {
      console.error("Failed to deactivate group:", error);
      setLocalGroup(group);
    }
  };

  const handleActivateGroup = async () => {
    try {
      setLocalGroup(prev =>
        prev ? { ...prev, status: "ACTIVE" } : prev
      );

      await GroupAPI.activateGroup(localGroup.uid);
    } catch (error) {
      console.error("Failed to activate group:", error);
      setLocalGroup(group);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Avatar className="size-7">
                  {localGroup.avatar_url?.public_url ? (
                    <AvatarImage src={localGroup.avatar_url.public_url} />
                  ) : (
                    <AvatarFallback
                      className={`bg-gradient-to-br ${getAvatarGradient(localGroup.uid)} text-white font-semibold`}
                    >
                      {localGroup.name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <DialogTitle className="text-2xl">{localGroup.name}</DialogTitle>
              </div>
              <p className="text-sm text-gray-500 mt-1">Group ID: {localGroup.uid}</p>
            </div>
            <Badge
              variant={localGroup.status === "ACTIVE" ? "default" : "secondary"}
              className={
                localGroup.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {localGroup.status}
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
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-xl font-semibold">
                    {localGroup.total_members}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Group Leader</p>
                <div className="flex items-center gap-3 mb-1">
                  <Avatar className="size-7">
                    {localGroup.leader.avatar_url?.public_url ? (
                      <AvatarImage src={localGroup.leader.avatar_url.public_url} />
                    ) : (
                      <AvatarFallback
                        className={`bg-gradient-to-br ${getAvatarGradient(localGroup.leader.uid)} text-white font-semibold`}
                      >
                        {localGroup.leader.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <p className="font-semibold">{localGroup.leader.full_name}</p>
                </div>
                {/* <p className="text-sm text-gray-500">{localGroup.leader.email}</p> */}
              </div>

              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="text-base font-semibold">
                    {formatDate(localGroup.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {localGroup.status === "ACTIVE" ? (
              <Button size="sm" className="mt-3 bg-rose-600 hover:bg-rose-700 text-white"
                onClick={handleDeactivateGroup}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate Group
              </Button>
              ) : (
                <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleActivateGroup}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Activate Group
              </Button>
              )
            }
          </TabsContent>

          <TabsContent value="members">
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.group_members_uid}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="size-7">
                      {member.user.avatar_url?.public_url ? (
                        <AvatarImage src={member.user.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(member.user.uid)} text-white font-semibold`}
                        >
                          {member.user.full_name.split(" ").map((n: string) => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.user.full_name}</p>
                      <p className="text-sm text-gray-500">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
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
              {loading && (
                <CardContent className="flex justify-center py-10">
                  <Spin />
                </CardContent>
              )}

              {!loading && activities.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No activities found</p>
                </div>
              )}

              {activities.map((activity) => (
                <div
                  key={activity.uid}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{activity.type}</p>
                    <p className="flex gap-2 items-center text-sm text-gray-600 mt-1">
                      by
                      <Avatar className="size-7">
                        {activity.from_user.avatar_url?.public_url ? (
                          <AvatarImage src={activity.from_user.avatar_url.public_url} />
                        ) : (
                          <AvatarFallback
                            className={`bg-gradient-to-br ${getAvatarGradient(activity.from_user.uid)} text-white font-semibold`}
                          >
                            {activity.from_user.full_name.split(" ").map((n: string) => n[0]).join("").split("").slice(0,2)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium">{activity.from_user.full_name}</span>
                      {activity.content && (
                        <span> - {activity.content}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-500">
                  Page {page} / {totalPages}
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
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
