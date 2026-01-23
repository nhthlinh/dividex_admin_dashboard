import { useState } from "react";

import {
  Users,
  DollarSign,
  Calendar,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { Group } from "./group.types";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { GroupDetailDialog } from "./GroupDetailDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";

const groupStats = [
  {
    icon: Users,
    label: "Total Groups",
    value: "45",
    change: "+12% from last month",
    trend: "up",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    icon: Users,
    label: "Active Groups",
    value: "38",
    change: "+8% from last month",
    trend: "up",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: DollarSign,
    label: "Total Balance",
    value: "$125.5k",
    change: "+15% from last month",
    trend: "up",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Users,
    label: "Total Members",
    value: "342",
    change: "+5% from last month",
    trend: "up",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

const mockGroups: Group[] = [
  {
    uid: "grp-001",
    name: "Team Alpha",
    leader: {
      uid: "usr-001",
      full_name: "Amy Roo",
      email: "amy.roo@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    total_members: 12,
    total_balance: 5420.5,
    status: "ACTIVE",
    created_at: "2024-01-15T10:30:00Z",
    avatar_url: {
      public_url: ""
    }
  },
  {
    uid: "grp-002",
    name: "Marketing Squad",
    leader: {
      uid: "usr-002",
      full_name: "Hana Ghoghly",
      email: "hana.g@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    total_members: 8,
    total_balance: 3210.75,
    status: "ACTIVE",
    created_at: "2024-02-10T14:20:00Z",
    avatar_url: {
      public_url: ""
    }
  },
  {
    uid: "grp-003",
    name: "Development Team",
    leader: {
      uid: "usr-003",
      full_name: "Nguyễn Hồ Thúy Linh",
      email: "linh.nguyen@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    total_members: 15,
    total_balance: 8950.0,
    status: "ACTIVE",
    created_at: "2023-12-05T09:15:00Z",
    avatar_url: {
      public_url: ""
    }
  },
  {
    uid: "grp-004",
    name: "Sales Force",
    leader: {
      uid: "usr-004",
      full_name: "Nguyễn Hồ Chi Vũ",
      email: "vu.nguyen@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    total_members: 10,
    total_balance: 4560.25,
    status: "ACTIVE",
    created_at: "2024-01-20T16:45:00Z",
    avatar_url: {
      public_url: ""
    }
  },
  {
    uid: "grp-005",
    name: "Design Studio",
    leader: {
      uid: "usr-005",
      full_name: "John Smith",
      email: "john.smith@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    total_members: 6,
    total_balance: 2890.0,
    status: "INACTIVE",
    created_at: "2023-11-15T11:00:00Z",
    avatar_url: {
      public_url: ""
    }
  },
  {
    uid: "grp-006",
    name: "Product Team",
    leader: {
      uid: "usr-006",
      full_name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    total_members: 9,
    total_balance: 6750.5,
    status: "ACTIVE",
    created_at: "2024-02-25T13:30:00Z",
    avatar_url: {
      public_url: ""
    }
  },
];

const PAGE_SIZE = 2;

export function GroupPage() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [total] = useState(mockGroups.length);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredGroups = mockGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex gap-3">
          <Button size="sm" className="text-white bg-rose-600 hover:bg-rose-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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
                placeholder="Search groups..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <Card
                key={group.uid}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border hover:border-rose-300"
                onClick={() => handleGroupClick(group)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 max-w-20">
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
                        <h3 className="font-semibold text-lg mb-1">
                          {group.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500">ID: {group.uid}</p>
                    </div>
                    <Badge
                      variant={
                        group.status === "ACTIVE" ? "default" : "secondary"
                      }
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
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Members</span>
                      </div>
                      <span className="font-semibold">
                        {group.total_members}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">Balance</span>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(group.total_balance)}
                      </span>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
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
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {group.leader.full_name}
                          </p>
                          <p className="text-xs text-gray-500">Group Leader</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <Calendar className="h-3 w-3" />
                        <span>Created {formatDate(group.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No groups found</p>
            </div>
          )}

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

      <GroupDetailDialog
        group={selectedGroup}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
