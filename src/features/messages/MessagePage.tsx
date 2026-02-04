import { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  MessageSquare,
  Search,
  TrendingUp,
  Users,
  Send,
  Paperclip,
} from "lucide-react";
import type { MessageGroupItem, MessageManagement, MessagesInGroupItem } from "./messages.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";
import { MessageAPI } from "./messages.api"; 

export function MessagePage() { 
  const [allGroups, setAllGroups] = useState<MessageGroupItem[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<MessageGroupItem | null>(null);
  const [messageGroups, setMessageGroups] = useState<MessagesInGroupItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Số nhóm
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Số tin nhắn trong nhóm
  const [pageMessage, setPageMessage] = useState(1);
  const [totalPagesMessage, setTotalPagesMessage] = useState(1);

  const [statistics, setStatistics] = useState<MessageManagement | null>(null);

  useEffect(() => {
    const fetchMessageGroups = async () => {
      setLoading(true);
      const groups = await MessageAPI.getMessageGroups({
        page: page,
        page_size: 10,
      });
      if (groups.content.length > 0) {
        setAllGroups(groups.content);
        setSelectedGroup(groups.content[0]);
        setTotalPages(groups.total_pages);
      }
      setLoading(false);
    }
    fetchMessageGroups();
  }, [page]);

  useEffect(() => { 
    const fetchMessagesInGroup = async () => {
      if (selectedGroup) {
        setLoading(true);
        const messagesInGroup = await MessageAPI.getMessagesInGroup(selectedGroup.uid, {
          page: pageMessage,
          page_size: 10,
        });
        setLoading(false); 
        setMessageGroups(messagesInGroup.content);
        setTotalPagesMessage(messagesInGroup.content[0].total_messages ? Math.ceil(messagesInGroup.content[0].total_messages / 10) : 1);
      }
    }
    fetchMessagesInGroup();
  }, [selectedGroup, pageMessage]);

  useEffect(() => {
    const fetchMessageManagement = async () => {
      setLoading(true);
      await MessageAPI.getMessageManagement().then(setStatistics);
      setLoading(false);
    }
    fetchMessageManagement();
  }, []);

  const messageStats = statistics
    ? [
        {
        icon: MessageSquare,
        label: "Total Messages",
        value: statistics.total_messages,
        change: statistics.percent_increase_messages + "% from last month",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-500",
      },
      {
        icon: Users,
        label: "Active Groups",
        value: statistics.active_groups,
        change: statistics.percent_increase_active_groups + "% from last month",
        bgColor: "bg-green-50",
        iconColor: "text-green-500",
      },
      {
        icon: Send,
        label: "Messages Today",
        value: statistics.message_today,
        change: statistics.percent_increase_message_today + "% from yesterday",
        bgColor: "bg-purple-50",
        iconColor: "text-purple-500",
      },
      {
        icon: Paperclip,
        label: "Attachments",
        value: statistics.attachments,
        change: statistics.percent_increase_attachments + "% from last month",
        bgColor: "bg-orange-50",
        iconColor: "text-orange-500",
      },
    ] : [];


  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      case "EDITED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMessages = messageGroups.filter(
    (message) =>
      message.messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      ).length > 0
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Message Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor group conversations and messages
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {messageStats.map((stat, index) => (
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

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Group List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Group Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allGroups.length === 0 && <p>No groups available.</p>}
              {allGroups.map((group) => (
                <Card 
                  key={group.uid}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedGroup?.uid === group.uid
                      ? "border-pink-500 bg-pink-50"
                      : "hover:border-pink-200"
                  }`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">
                        {group.group_name}
                      </h3>
                      {group.total_messages_unread! > 0 && (
                        <Badge className="bg-pink-600 text-white">
                          {group.total_messages_unread}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {group.last_message_content}
                      </p>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {formatDateTime(group.last_message)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{group.total_members} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{group.total_messages} messages</span>
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

        {/* Message List */}
        <Card className="col-span-2 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>{selectedGroup?.group_name}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedGroup?.total_members} participants •{" "}
                  {selectedGroup?.total_messages} messages
                </p>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => (
                message.messages.map((msg) => (
                  <Card
                    key={msg.uid}
                    className={`cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-pink-200`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-7">
                          {msg.sender.avatar_url?.public_url ? (
                            <AvatarImage src={msg.sender.avatar_url.public_url} />
                          ) : (
                            <AvatarFallback
                              className={`bg-gradient-to-br ${getAvatarGradient(msg.sender.uid)} text-white font-semibold`}
                            >
                              {msg.sender.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm">
                                {msg.sender.full_name}
                              </p>
                              <Badge
                                variant="secondary"
                                className={getStatusColor(msg.status)}
                              >
                                {msg.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatTime(msg.created_at)}
                            </p>
                          </div>

                          <p className="text-sm text-gray-700 mb-2">
                            {msg.content}
                          </p>

                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              {msg .attachments.map((attachment) => (
                                <div
                                  key={attachment.uid}
                                  className="flex items-center gap-2 p-2 bg-gray-100 rounded text-xs"
                                >
                                  <Paperclip className="h-3 w-3 text-gray-600" />
                                  <span className="font-medium">
                                    {attachment.original_name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
                
              ))}
            </div>

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages found</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-gray-500">
                Page {pageMessage} / {totalPagesMessage}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pageMessage === 1}
                  onClick={() => setPageMessage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pageMessage >= totalPagesMessage}
                  onClick={() => setPageMessage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
