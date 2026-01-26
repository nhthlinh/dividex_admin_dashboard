import { useEffect, useState } from "react";

import {
  Users,
  Calendar,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import type { EventItem, EventStatistics } from "./event.types";
import { EventDetailDialog } from "./EventDetailDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";
import { EventAPI } from "./event.api";
import { Spin } from "antd";

const PAGE_SIZE = 2;

export function EventPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<EventStatistics | null>(null);

  useEffect(() => {
    EventAPI.getEventStatistics().then(setStats);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await EventAPI.getEvents({
          search: searchQuery || undefined,
          page,
          page_size: PAGE_SIZE,
        });

        setEvents(res.content);
        setTotal(res.total_pages);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchQuery, page]);

  const eventStats = stats
    ? [
        {
          icon: Calendar,
          label: "Total Events",
          value: stats.total_events.toString(),
          change: `+${stats.percent_increase_events}% from last month`,
          bgColor: "bg-pink-50",
          iconColor: "text-pink-500",
        },
        {
          icon: Clock,
          label: "Active Events",
          value: stats.active_events.toString(),
          change: `+${stats.percent_increase_active_events}% from last month`,
          bgColor: "bg-orange-50",
          iconColor: "text-orange-500",
        },
        {
          icon: CheckCircle,
          label: "Completed Events",
          value: stats.total_finished_events.toString(),
          change: `+${stats.percent_increase_finished_events}% from last month`,
          bgColor: "bg-green-50",
          iconColor: "text-green-500",
        },
        {
          icon: Users,
          label: "Total Participants",
          value: stats.total_members.toString(),
          change: `+${stats.percent_increase_members}% from last month`,
          bgColor: "bg-purple-50",
          iconColor: "text-purple-500",
        },
      ]
    : [];

  const handleEventClick = (event: EventItem) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Clock className="h-3 w-3" />;
      case "COMPLETED":
        return <CheckCircle className="h-3 w-3" />;
      case "CANCELLED":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const isEventUpcoming = (eventStart: string) => {
    return new Date(eventStart) > new Date();
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.event_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Event Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all events</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {eventStats.map((stat, index) => (
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

      {/* Search and Filter */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Events</CardTitle>
            <div className="flex gap-3">
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "ALL" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("ALL")}
                  className={
                    filterStatus === "ALL" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "ACTIVE" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("ACTIVE")}
                  className={
                    filterStatus === "ACTIVE"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : ""
                  }
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "COMPLETED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("COMPLETED")}
                  className={
                    filterStatus === "COMPLETED"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : ""
                  }
                >
                  Completed
                </Button>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
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
            {loading && (
              <CardContent className="flex justify-center py-10">
                <Spin />
              </CardContent>
            )}
            {filteredEvents.map((event) => (
              <Card
                key={event.event_uid}
                className="cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-rose-300"
                onClick={() => handleEventClick(event)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-rose-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {event.event_name}
                            </h3>
                            {isEventUpcoming(event.event_start) && (
                              <Badge
                                variant="secondary"
                                className="bg-orange-100 text-orange-800 text-xs"
                              >
                                Upcoming
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            ID: {event.event_uid}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`flex items-center gap-1 ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {getStatusIcon(event.status)}
                          {event.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Group</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                              {event.group.avatar_url?.public_url ? (
                                <AvatarImage src={event.group.avatar_url.public_url} />
                              ) : (
                                <AvatarFallback
                                  className={`bg-gradient-to-br ${getAvatarGradient(event.group.uid)} text-white font-semibold`}
                                >
                                  {event.group.name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <p className="font-semibold text-sm truncate">
                              {event.group.name}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Creator</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                              {event.creator.avatar_url?.public_url ? (
                                <AvatarImage src={event.creator.avatar_url.public_url} />
                              ) : (
                                <AvatarFallback
                                  className={`bg-gradient-to-br ${getAvatarGradient(event.creator.uid)} text-white font-semibold`}
                                >
                                  {event.creator.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <p className="font-semibold text-sm truncate">
                              {event.creator.full_name}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Start Date</p>
                          <p className="font-semibold text-sm">
                            {formatDate(event.event_start)}
                          </p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">End Date</p>
                          <p className="font-semibold text-sm">
                            {formatDate(event.event_end)}
                          </p>
                        </div>
                      </div>

                      {event.event_description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {event.event_description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No events found</p>
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

      <EventDetailDialog
        event={selectedEvent}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}