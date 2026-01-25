import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  MessageSquare,
  Search,
  TrendingUp,
  Users,
  Send,
  Paperclip,
  Trash2,
  Pin,
  Edit,
  Calendar,
} from "lucide-react";
import type { GroupConversation, Message } from "./messages.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";

const messageStats = [
  {
    icon: MessageSquare,
    label: "Total Messages",
    value: "15,432",
    change: "+28% from last month",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: Users,
    label: "Active Groups",
    value: "234",
    change: "+15% from last month",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Send,
    label: "Messages Today",
    value: "1,245",
    change: "+32% from yesterday",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    icon: Paperclip,
    label: "Attachments",
    value: "3,456",
    change: "+18% from last month",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

const mockGroupConversations: GroupConversation[] = [
  {
    group_uid: "grp-001",
    group_name: "Weekend Trip Planning",
    message_count: 245,
    unread_count: 12,
    participants: [
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
    last_message: {
      uid: "msg-001",
      content: "Don't forget to bring your cameras for the trip!",
      user: {
        uid: "usr-001",
        full_name: "Amy Roo",
        email: "amy.roo@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      status: "ACTIVE",
      group_uid: "grp-001",
      group_name: "Weekend Trip Planning",
      created_at: "2024-03-20T10:30:00Z",
      group_avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      },
    },
  },
  {
    group_uid: "grp-002",
    group_name: "Office Party Organizers",
    message_count: 189,
    unread_count: 5,
    participants: [
      {
        uid: "usr-002", full_name: "Hana Ghoghly", email: "hana.g@example.com",
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
      {
        uid: "usr-005", full_name: "Nguyễn Hồ Chi Vũ", email: "vu.nguyen@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
    ],
    last_message: {
      uid: "msg-002",
      content: "I've booked the venue for next Friday",
      user: {
        uid: "usr-002",
        full_name: "Hana Ghoghly",
        email: "hana.g@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      status: "ACTIVE",
      group_uid: "grp-002",
      group_name: "Office Party Organizers",
      created_at: "2024-03-20T09:15:00Z",
    },
  },
  {
    group_uid: "grp-003",
    group_name: "Project Alpha Team",
    message_count: 567,
    unread_count: 28,
    participants: [
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
      {
        uid: "usr-004", full_name: "John Smith", email: "john.smith@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      {
        uid: "usr-005", full_name: "Nguyễn Hồ Chi Vũ", email: "vu.nguyen@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
    ],
    last_message: {
      uid: "msg-003",
      content: "Meeting rescheduled to 3 PM",
      user: {
        uid: "usr-004",
        full_name: "John Smith",
        email: "john.smith@example.com",
        avatar_url: {
          uid: "",
          original_name: undefined,
          public_url: undefined
        }
      },
      status: "ACTIVE",
      group_uid: "grp-003",
      group_name: "Project Alpha Team",
      created_at: "2024-03-20T08:45:00Z",
    },
  },
];

const mockMessages: Message[] = [
  {
    uid: "msg-101",
    content: "Hey everyone! Just created the expense for our team dinner last night.",
    user: {
      uid: "usr-001",
      full_name: "Amy Roo",
      email: "amy.roo@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    status: "ACTIVE",
    group_uid: "grp-001",
    group_name: "Weekend Trip Planning",
    created_at: "2024-03-20T10:30:00Z",
    is_pinned: false,
  },
  {
    uid: "msg-102",
    content: "Thanks! I'll review it now.",
    user: {
      uid: "usr-002",
      full_name: "Hana Ghoghly",
      email: "hana.g@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    status: "ACTIVE",
    group_uid: "grp-001",
    group_name: "Weekend Trip Planning",
    created_at: "2024-03-20T10:32:00Z",
    is_pinned: false,
  },
  {
    uid: "msg-103",
    content: "Can we split the hotel costs equally?",
    user: {
      uid: "usr-003",
      full_name: "Nguyễn Hồ Thúy Linh",
      email: "linh.nguyen@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    status: "ACTIVE",
    group_uid: "grp-001",
    group_name: "Weekend Trip Planning",
    created_at: "2024-03-20T10:35:00Z",
    is_pinned: false,
  },
  {
    uid: "msg-104",
    content: "Sure, I'll update the expense to split equally.",
    user: {
      uid: "usr-001",
      full_name: "Amy Roo",
      email: "amy.roo@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    status: "ACTIVE",
    group_uid: "grp-001",
    group_name: "Weekend Trip Planning",
    created_at: "2024-03-20T10:37:00Z",
    is_pinned: true,
  },
  {
    uid: "msg-105",
    content: "Don't forget to bring your cameras for the trip!",
    user: {
      uid: "usr-001",
      full_name: "Amy Roo",
      email: "amy.roo@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    status: "ACTIVE",
    group_uid: "grp-001",
    group_name: "Weekend Trip Planning",
    created_at: "2024-03-20T11:00:00Z",
    is_pinned: false,
    attachments: [
      {
        uid: "att-001",
        url: "#",
        name: "trip-itinerary.pdf",
        type: "pdf",
        size: "1.2 MB",
      },
    ],
  },
];

export function MessagePage() {
  const [selectedGroup, setSelectedGroup] = useState<GroupConversation | null>(
    mockGroupConversations[0]
  );
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteMessage = (message: Message) => {
    alert(`Deleted message: ${message.uid}`);
    setIsDetailDialogOpen(false);
  };

  const handlePinMessage = (message: Message) => {
    alert(`${message.is_pinned ? "Unpinned" : "Pinned"} message: ${message.uid}`);
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

  const filteredMessages = mockMessages.filter(
    (message) =>
      message.group_uid === selectedGroup?.group_uid &&
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
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
              {mockGroupConversations.map((group) => (
                <Card
                  key={group.group_uid}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedGroup?.group_uid === group.group_uid
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
                      {group.unread_count! > 0 && (
                        <Badge className="bg-pink-600 text-white">
                          {group.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {group.last_message?.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{group.participants.length} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{group.message_count} messages</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                  {selectedGroup?.participants.length} participants •{" "}
                  {selectedGroup?.message_count} messages
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
                <Card
                  key={message.uid}
                  className={`cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-pink-200 ${
                    message.is_pinned ? "border-blue-300 bg-blue-50" : ""
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-7">
                        {message.user.avatar_url?.public_url ? (
                          <AvatarImage src={message.user.avatar_url.public_url} />
                        ) : (
                          <AvatarFallback
                            className={`bg-gradient-to-br ${getAvatarGradient(message.user.uid)} text-white font-semibold`}
                          >
                            {message.user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">
                              {message.user.full_name}
                            </p>
                            {message.is_pinned && (
                              <Pin className="h-4 w-4 text-blue-600" />
                            )}
                            <Badge
                              variant="secondary"
                              className={getStatusColor(message.status)}
                            >
                              {message.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatTime(message.created_at)}
                          </p>
                        </div>

                        <p className="text-sm text-gray-700 mb-2">
                          {message.content}
                        </p>

                        {message.attachments && message.attachments.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.uid}
                                className="flex items-center gap-2 p-2 bg-gray-100 rounded text-xs"
                              >
                                <Paperclip className="h-3 w-3 text-gray-600" />
                                <span className="font-medium">
                                  {attachment.name}
                                </span>
                                <span className="text-gray-500">
                                  ({attachment.size})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Detail Dialog */}
      {selectedMessage && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Avatar className="size-7">
                    {selectedMessage.user.avatar_url?.public_url ? (
                      <AvatarImage src={selectedMessage.user.avatar_url.public_url} />
                    ) : (
                      <AvatarFallback
                        className={`bg-gradient-to-br ${getAvatarGradient(selectedMessage.user.uid)} text-white font-semibold`}
                      >
                        {selectedMessage.user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold">
                        {selectedMessage.user.full_name}
                      </p>
                      {selectedMessage.is_pinned && (
                        <Badge className="bg-blue-600">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={getStatusColor(selectedMessage.status)}
                      >
                        {selectedMessage.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {selectedMessage.user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Message Content</p>
                <p className="text-gray-900">{selectedMessage.content}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Group</p>
                  </div>
                  <p className="font-semibold">{selectedMessage.group_name}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Sent At</p>
                  </div>
                  <p className="font-semibold">
                    {formatDateTime(selectedMessage.created_at)}
                  </p>
                </div>
              </div>

              {selectedMessage.attachments &&
                selectedMessage.attachments.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">
                      Attachments ({selectedMessage.attachments.length})
                    </p>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment) => (
                        <div
                          key={attachment.uid}
                          className="flex items-center justify-between p-3 bg-white rounded"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded">
                              <Paperclip className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {attachment.size} • {attachment.type}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedMessage.updated_at && (
                <div className="p-4 bg-yellow-50 rounded-lg flex items-center gap-2">
                  <Edit className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    This message was edited on{" "}
                    {formatDateTime(selectedMessage.updated_at)}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => handlePinMessage(selectedMessage)}
              >
                <Pin className="h-4 w-4 mr-2" />
                {selectedMessage.is_pinned ? "Unpin" : "Pin"} Message
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeleteMessage(selectedMessage)}
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
    </div>
  );
}
