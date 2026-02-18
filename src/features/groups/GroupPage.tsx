import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Search,
  TrendingUp,
  TrendingDown,
  Group,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

import { GroupDetailDialog } from "./GroupDetailDialog";
import { getAvatarGradient } from "../../components/Header";
import type { GroupItem, GroupStatistics } from "./group.types";
import { GroupAPI } from "./group.api";
import { Spin } from "antd";

const PAGE_SIZE = 2;

export function GroupPage() {
  const [stats, setStats] = useState<GroupStatistics | null>(null);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    GroupAPI.getGroupStatistics().then(setStats);
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await GroupAPI.getGroups({
          search: searchQuery || undefined,
          page,
          page_size: PAGE_SIZE,
        });

        setGroups(res.content);
        setTotalPages(res.total_pages);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [searchQuery, page]);

  const groupStats = stats
    ? [
        {
          icon: Group,
          label: "Total Groups",
          value: stats.total_groups,
          change: `${stats.percent_increase_groups}% from last month`,
          trend: stats.percent_increase_groups >= 0 ? "up" : "down",
          bgColor: "bg-pink-50",
          iconColor: "text-pink-500",
        },
        {
          icon: Users,
          label: "Active Groups",
          value: stats.active_groups,
          change: `${stats.percent_increase_active_groups}% from last month`,
          trend: stats.percent_increase_active_groups >= 0 ? "up" : "down",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-500",
        },
        {
          icon: Users,
          label: "Total Members",
          value: stats.total_members,
          change: `${stats.percent_increase_members}% from last month`,
          trend: stats.percent_increase_members >= 0 ? "up" : "down",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-500",
        },
        {
          icon: TrendingUp,
          label: "Avg. Members per Group",
          value: stats.total_groups !== 0 ? (stats.total_members / stats.total_groups).toFixed(2) : 0,
          change: `${stats.percent_increase_members / stats.total_groups}% from last month`,
          trend: stats.percent_increase_members >= 0 ? "up" : "down",
          bgColor: "bg-green-50",
          iconColor: "text-green-500",
        }
      ]
    : [];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleGroupClick = (group: GroupItem) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Group Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all groups
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {groupStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>
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

      {/* Search and Filter */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Groups</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => {
                  setPage(1);
                  setSearchQuery(e.target.value);
                }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading && (
            <CardContent className="flex justify-center py-10">
              <Spin />
            </CardContent>
          )}

          {!loading && groups.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No groups found</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <Card
                key={group.uid}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border hover:border-rose-300"
                onClick={() => handleGroupClick(group)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-7">
                          {group.avatar_url?.public_url ? (
                            <AvatarImage src={group.avatar_url.public_url} />
                          ) : (
                            <AvatarFallback
                              className={`bg-gradient-to-br ${getAvatarGradient(
                                group.uid
                              )} text-white`}
                            >
                              {group.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <h3 className="font-semibold text-lg mb-1">
                          {group.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500">ID: {group.uid.split("-")[0]} ...</p>
                    </div>
                    <Badge
                      className={
                        group.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {group.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-600">Members</span>
                      <span className="font-semibold">
                        {group.total_members}
                      </span>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${getAvatarGradient(
                              group.leader.uid
                            )} text-white`}
                          >
                            {group.leader.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {group.leader.full_name.split(" ").slice(-2).map(n => n).join(" ")}
                          </p>
                          <p className="text-xs text-gray-500">
                            Group Leader
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <Calendar className="h-3 w-3" />
                        Created {formatDate(group.created_at)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
        </CardContent>
      </Card>

      <GroupDetailDialog
        group={selectedGroup}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
