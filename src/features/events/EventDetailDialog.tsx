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
  Trash2,
  Unlock,
} from "lucide-react";
import type { EventItem, ExpenseSimpleListResponse } from "./event.types";
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

export function EventDetailDialog({ event, open, onOpenChange }: EventDetailDialogProps) {
  const [localEvent, setLocalEvent] = useState<EventItem | null>(event);

  const [participants, setParticipants] = useState<User[]>([]);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [participantsPage, setParticipantsPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>("");

  const [expenses, setExpenses] = useState<ExpenseSimpleListResponse | null>(null);

  useEffect(() => {
    setLocalEvent(event);
  }, [event]);

  useEffect(() => {
    if (!localEvent) return;

    const fetchParticipants = async () => {
      setLoading(true);
      const p = await EventAPI.getEventMembers({
        event_uid: localEvent.event_uid,
        page: participantsPage,
        page_size: 20,
        search: inputSearch,
      });

      const users = p.content.map((m) => m.user_infor);

      setParticipants(users);
      setTotalParticipants(p.total_rows);
      setParticipantsPage(p.current_page);
      setLoading(false);
    };

    const fetchExpenses = async () => {
      const exp = await EventAPI.getExpensesInEvent(localEvent.event_uid);
      setExpenses(exp);
    }

    fetchParticipants();
    fetchExpenses();
  }, [localEvent?.event_uid, participantsPage, inputSearch]);

  if (!open || !event || !localEvent) return null;

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
  const startDate = new Date(localEvent.event_start);
  const endDate = new Date(localEvent.event_end);
  const durationDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalParticipantPages = Math.ceil(totalParticipants / 20);
  const totalExpenses = expenses ? expenses.total_amount : 0;

  const handleGoToExpensePage = () => {
    window.location.href = `/expense/event/${localEvent.event_uid}`;
  }

  const handleDeactivateEvent = async () => {
    try {
      setLocalEvent(prev =>
        prev ? { ...prev, status: "INACTIVE" } : prev
      );

      await EventAPI.deactivateEvent(localEvent.event_uid);
    } catch (error) {
      console.error("Failed to deactivate event:", error);
      setLocalEvent(event);
    }
  };

  const handleActivateEvent = async () => {
    try {
      setLocalEvent(prev =>
        prev ? { ...prev, status: "ACTIVE" } : prev
      );

      await EventAPI.activateEvent(localEvent.event_uid);
    } catch (error) {
      console.error("Failed to activate event:", error);
      setLocalEvent(event);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{localEvent.event_name}</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Event ID: {localEvent.event_uid}</p>
            </div>
            <Badge variant="secondary" className={getStatusColor(localEvent.status)}>
              {localEvent.status}
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
                      {localEvent.creator.avatar_url?.public_url ? (
                        <AvatarImage src={localEvent.creator.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(localEvent.creator.uid)} text-white font-semibold`}
                        >
                          {localEvent.creator.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p className="font-semibold">{localEvent.creator.full_name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{localEvent.creator.email}</p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Event Period</p>
                    <p className="font-semibold text-sm">
                      {formatDate(localEvent.event_start)} -{" "}
                      {formatDate(localEvent.event_end)}
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
                      {localEvent.group.avatar_url?.public_url ? (
                        <AvatarImage src={localEvent.group.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(localEvent.group.uid)} text-white font-semibold`}
                        >
                          {localEvent.group.name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )} 
                    </Avatar>
                    <p className="font-semibold">{localEvent.group.name}</p>
                  </div> 
                  <p className="text-sm text-gray-500">
                    Group ID: {localEvent.group.uid}
                  </p>
                </div>
              </div>
            </div>

            {localEvent.event_description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-700">
                    Description
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {localEvent.event_description}
                </p>
              </div>
            )}

            {localEvent.status === "ACTIVE" ? (
              <Button size="sm" className="mt-3 bg-rose-600 hover:bg-rose-700 text-white"
                onClick={handleDeactivateEvent}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate Event
              </Button>
              ) : (
                <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleActivateEvent}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Activate Event
              </Button>
              )
            }
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
                <div className="flex justify-center my-6"> 
                  <Spin />
                </div>
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
                    {totalExpenses.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })} đ
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                { expenses?.expenses.map((expense) => (
                  <div
                    key={expense.uid} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{expense.name}</p>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        Paid by 
                        <Avatar className="size-7">
                          {expense.paid_by.avatar_url?.public_url ? (
                            <AvatarImage src={expense.paid_by.avatar_url.public_url} />
                          ) : (
                            <AvatarFallback
                              className={`bg-gradient-to-br ${getAvatarGradient(expense.paid_by.uid)} text-white font-semibold`}
                            >
                              {expense.paid_by.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {expense.paid_by.full_name} • {formatDate(expense.expense_date)}
                      </p>
                    </div>
                    <p className="font-bold text-lg">
                      {expense.total_amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })} đ
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
