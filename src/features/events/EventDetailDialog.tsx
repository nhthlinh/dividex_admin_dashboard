import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import {
  Calendar,
  User as UserIcon,
  Users,
  FileText,
  DollarSign,
} from "lucide-react";
import type { EventItem } from "./event.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";
import { useEffect, useState } from "react";
import type { User } from "../users/user.types";
import { EventAPI } from "./event.api";
import { Input } from "../../components/ui/input";
import { Spin } from "antd";

interface EventDetailDialogProps {
  event: EventItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailDialog({
  event,
  open,
  onOpenChange,
}: EventDetailDialogProps) {
  if (!event) return null;

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

  // Calculate event duration
  const startDate = new Date(event.event_start);
  const endDate = new Date(event.event_end);
  const durationDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const [participants, setParticipants] = useState<User[]>([])
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [participantsPage, setParticipantsPage] = useState<number>(1);
  const totalParticipantPages = Math.ceil(totalParticipants / 20);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>("");

  useEffect(() => {
    const fetchParticipants = async () => {
      const p = await EventAPI.getEventMembers(
        {
          page: participantsPage,
          page_size: 20,
          search: inputSearch,
        }
      );
      const users = p.content
        .filter((member) => member.event_member_uid === event.event_uid)
        .map((member) => member.user);
      setParticipants(users);
      setTotalParticipants(p.total_rows);
      setParticipantsPage(p.current_page);
      setLoading(false);
    }
    fetchParticipants();
  }, [event.event_uid]);

  // Mock expenses
  const expenses = [
    {
      id: "1",
      description: "Venue booking",
      amount: 500.0,
      paid_by: {
        uid: "1",
        name: "Amy Roo",
        email: "amy.roo@example.com",
        status: "Confirmed",
        avatar_url: {
          public_url: "",
        },
      },
      date: "2024-03-01",
    },
    {
      id: "2",
      description: "Catering",
      amount: 350.0,
      paid_by: {
        uid: "2",
        name: "Hana Ghoghly",
        email: "hana.g@example.com",
        status: "Confirmed",
        avatar_url: {
          public_url: "",
        },
      },
      date: "2024-03-05",
    },
    {
      id: "3",
      description: "Equipment rental",
      amount: 200.0,
      paid_by: {
        uid: "1",
        name: "Amy Roo",
        email: "amy.roo@example.com",
        status: "Confirmed",
        avatar_url: {
          public_url: "",
        },
      },
      date: "2024-03-08",
    },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleGoToExpensePage = () => {
    window.location.href = `/expense/event/${event.event_uid}`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{event.event_name}</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Event ID: {event.event_uid}</p>
            </div>
            <Badge variant="secondary" className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
          </div>
          <Button size="sm" className="mt-3 bg-rose-600 hover:bg-rose-700 text-white"
            onClick={handleGoToExpensePage}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Go to event's expense
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
            <TabsTrigger value="participants">
              <div className="text-center">
                <p className="text-sm font-semibold">Participants</p>
                <p className="text-xs opacity-70">Attendees List</p>
              </div>
            </TabsTrigger>
            <TabsTrigger value="expenses">
              <div className="text-center">
                <p className="text-sm font-semibold">Expenses</p>
                <p className="text-xs opacity-70">Transaction in event</p>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="h-4 w-4 text-purple-600" />
                    <p className="text-sm text-gray-600">Creator</p>
                  </div>
                  <div className="flex flex-row items-center gap-3 mb-1">
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
                    <p className="font-semibold">{event.creator.full_name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{event.creator.email}</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Event Period</p>
                    <p className="font-semibold text-sm">
                      {formatDate(event.event_start)} -{" "}
                      {formatDate(event.event_end)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {durationDays} day{durationDays > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-gray-600">Group</p>
                  </div>
                  <div className="flex flex-row items-center gap-3 mb-1">
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
                    <p className="font-semibold">{event.group.name}</p>
                  </div> 
                  <p className="text-sm text-gray-500">
                    Group ID: {event.group.uid}
                  </p>
                </div>
              </div>
            </div>

            {event.event_description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-700">
                    Description
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {event.event_description}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="participants">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <Input
                  type="text"
                  placeholder="Search participants..."
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                />
              </div>

              {loading && (
                <Spin />
              )}

              {participants.length === 0 && (
                <p className="text-center text-gray-500">No participants found.</p>
              )}

              {participants.map((participant) => (
                <div
                  key={participant.uid}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="size-10">
                      {participant.avatar_url?.public_url ? (
                        <AvatarImage src={participant.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(participant.uid)} text-white font-semibold`}
                        >
                          {participant.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold">{participant.full_name}</p>
                      <p className="text-sm text-gray-500">
                        {participant.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-slate-500">
                  Page {participantsPage} / {totalParticipantPages || 1}
                </span>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={participantsPage === 1}
                    onClick={() => setParticipantsPage((p) => p - 1)}
                  >
                    Previous
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={participantsPage >= totalParticipantPages}
                    onClick={() => setParticipantsPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {totalExpenses.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{expense.description}</p>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        Paid by 
                        <Avatar className="size-7">
                          {expense.paid_by.avatar_url?.public_url ? (
                            <AvatarImage src={expense.paid_by.avatar_url.public_url} />
                          ) : (
                            <AvatarFallback
                              className={`bg-gradient-to-br ${getAvatarGradient(expense.paid_by.uid)} text-white font-semibold`}
                            >
                              {expense.paid_by.name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {expense.paid_by.name} • {formatDate(expense.date)}
                      </p>
                    </div>
                    <p className="font-bold text-lg">
                      $
                      {expense.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
