import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import {
  DollarSign,
  User,
  Calendar,
  FileText,
  Trash2,
  Download,
  Image,
  Receipt,
  PieChart,
  Unlock,
} from "lucide-react";
import type { Expense, ExpenseAttachment, SplitUserShare } from "./expense.types";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";
import { useEffect, useState } from "react";
import { ExpenseAPI } from "./expense.api";

interface ExpenseDetailDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseDetailDialog({
  expense,
  open,
  onOpenChange,
}: ExpenseDetailDialogProps) {
  const [localExpense, setLocalExpense] = useState(expense);
  const [attachments, setAttachments] = useState<ExpenseAttachment[]>([]); // Placeholder for attachments
  const [userShares, setUserShares] = useState<SplitUserShare[]>([]); 

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      setLocalExpense(expense);
      const split = await ExpenseAPI.getSplitExpense(expense!.uid);

      const attachments = await ExpenseAPI.getExpenseAttachments(expense!.uid, {
        page: 1,
        page_size: 10,
      });

      setUserShares(split.list_user_shares);
      setAttachments(attachments.content);
    };

    if (expense) {
      fetchExpenseDetails();
    }
  }, [expense]);

  if (!localExpense) return null;

  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      USD: "$",
      VND: "₫",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
    };
    const symbol = currencySymbols[currency] || "$";
    
    if (currency === "VND") {
      return `${amount.toLocaleString("vi-VN")}${symbol}`;
    }
    
    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "SETTLED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSplitTypeLabel = (splitType: string) => {
    const labels: Record<string, string> = {
      EQUAL: "Split Equally",
      PERCENTAGE: "Split by Percentage",
      EXACT: "Exact Amount",
      SHARE: "Split by Shares",
    };
    return labels[splitType] || splitType;
  };

  const totalShares = userShares.reduce((sum, share) => sum + share.amount, 0);

  const handleDeactivateExpense = async () => {
    try {
      setLocalExpense(prev =>
        prev ? { ...prev, status: "INACTIVE" } : prev
      );

      await ExpenseAPI.deactivateExpense(localExpense.uid);
    } catch (error) {
      console.error("Failed to deactivate expense:", error);
      setLocalExpense(expense);
    }
  };

  const handleActivateExpense = async () => {
    try {
      setLocalExpense(prev =>
        prev ? { ...prev, status: "ACTIVE" } : prev
      );

      await ExpenseAPI.activateExpense(localExpense.uid);
    } catch (error) {
      console.error("Failed to activate expense:", error);
      setLocalExpense(expense);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{localExpense.name}</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Expense ID: {localExpense.uid}
              </p>
            </div>
            <Badge variant="secondary" className={getStatusColor(localExpense.status)}>
              {localExpense.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-2">
          <TabsList className="grid w-full grid-cols-3 gap-4 mb-2">
            <TabsTrigger value="info">
              <div className="text-center">
                <p className="text-sm">Info</p>
              </div>
            </TabsTrigger>
            <TabsTrigger value="splits">
              <div className="text-center">
                <p className="text-sm">Split details</p>
              </div>
            </TabsTrigger>
            <TabsTrigger value="attachments">
              <div className="text-center">
                <p className="text-sm">Attachments</p>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            {/* Amount Card */}
            <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(localExpense.total_amount, localExpense.currency)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {getSplitTypeLabel(localExpense.split_type)}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <DollarSign className="h-8 w-8 text-rose-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <p className="text-sm text-gray-600">Paid By</p>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="size-7">
                      {localExpense.paid_by.avatar_url?.public_url ? (
                        <AvatarImage src={localExpense.paid_by.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(localExpense.paid_by.uid)} text-white font-semibold`}
                        >
                          {localExpense.paid_by.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p className="font-semibold">{localExpense.paid_by.full_name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{localExpense.paid_by.email}</p>
                </div>

                {localExpense.category && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PieChart className="h-4 w-4 text-orange-600" />
                      <p className="text-sm text-gray-600">Category</p>
                    </div>
                    <p className="font-semibold">{localExpense.category.toLocaleUpperCase()}</p>
                  </div>
                )}

                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-rose-600" />
                    <p className="text-sm text-gray-600">Event</p>
                  </div>
                  <p className="font-semibold">{localExpense.event.name}</p>
                  <p className="text-sm text-gray-500">
                    Event ID: {localExpense.event.uid}
                  </p>
                </div>
              </div> 

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-gray-600">Created By</p>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="size-7">
                      {localExpense.creator.avatar_url?.public_url ? (
                        <AvatarImage src={localExpense.creator.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(localExpense.creator.uid)} text-white font-semibold`}
                        >
                          {localExpense.creator.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p className="font-semibold">{localExpense.creator.full_name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{localExpense.creator.email}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-gray-600">Expense Date</p>
                  </div>
                  <p className="font-semibold">
                    {formatDate(localExpense.expense_date)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Created At</p>
                  </div>
                  <p className="font-semibold text-sm">
                    {formatDateTime(localExpense.expense_date)}
                  </p>
                </div>
              </div>
            </div>

            {localExpense.note && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-700">Note</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {localExpense.note}
                </p>
              </div>
            )}

            {localExpense.status !== "ACTIVE" ? (
              <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleActivateExpense}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Activate Expense
              </Button>
              ) : (
              <Button size="sm" className="mt-3 bg-rose-600 hover:bg-rose-700 text-white"
                onClick={handleDeactivateExpense}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate Expense
              </Button>
              )
            }
          </TabsContent>

          <TabsContent value="splits">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Split Type</p>
                  <p className="text-lg font-bold text-gray-900">
                    {getSplitTypeLabel(localExpense.split_type)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="text-lg font-bold text-gray-900">
                    {userShares.length}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {userShares.map((share) => {
                  const percentage = (share.amount / totalShares) * 100;
                  return (
                    <div
                      key={share.user.uid}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            {share.user.avatar_url?.public_url ? (
                              <AvatarImage src={share.user.avatar_url.public_url} />
                            ) : (
                              <AvatarFallback
                                className={`bg-gradient-to-br ${getAvatarGradient(share.user.uid)} text-white font-semibold`}
                              >
                                {share.user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          
                          <div>
                            <p className="font-semibold">{share.user.full_name}</p>
                            <p className="text-sm text-gray-500">
                              {share.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatCurrency(share.amount, localExpense.currency)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {percentage.toFixed(1)}% of total
                          </p>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <p className="font-semibold">Total Split Amount</p>
                  <p className="font-bold text-xl">
                    {formatCurrency(totalShares, localExpense.currency)}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attachments">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Total Attachments: {attachments.length}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.uid}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 rounded-lg bg-blue-100"
                      >
                        <Image
                          className="h-6 w-6 text-blue-600"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{attachment.original_name}</p>
                        <p className="text-sm text-gray-500">
                          {attachment.size} •{" "}
                          {formatDateTime(attachment.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {attachments.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No attachments yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}