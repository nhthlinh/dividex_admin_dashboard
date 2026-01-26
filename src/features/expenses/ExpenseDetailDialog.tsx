import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import {
  DollarSign,
  User,
  Calendar,
  FileText,
  Edit,
  Trash2,
  Download,
  Image,
  Receipt,
  PieChart,
} from "lucide-react";
import type { Expense, UserShare } from "./expense.types";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";

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
  if (!expense) return null;

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

  // Mock user shares
  const userShares: UserShare[] = [
    {
      uid: "share-1",
      expense_uid: expense.uid,
      user: {
        uid: "usr-001",
        full_name: "Amy Roo",
        email: "amy.roo@example.com",
        avatar_url: { uid: "", original_name: undefined, public_url: undefined }
      },
      amount: 125.0,
      receiver_amount: 0,
      deleted: "ACTIVE",
    },
    {
      uid: "share-2",
      expense_uid: expense.uid,
      user: {
        uid: "usr-002",
        full_name: "Hana Ghoghly",
        email: "hana.g@example.com",
        avatar_url: { uid: "", original_name: undefined, public_url: undefined }
      },
      amount: 125.0,
      receiver_amount: 0,
      deleted: "ACTIVE",
    },
    {
      uid: "share-3",
      expense_uid: expense.uid,
      user: {
        uid: "usr-003",
        full_name: "Nguyễn Hồ Thúy Linh",
        email: "linh.nguyen@example.com",
        avatar_url: { uid: "", original_name: undefined, public_url: undefined }
      },
      amount: 125.0,
      receiver_amount: 0,
      deleted: "ACTIVE",
    },
    {
      uid: "share-4",
      expense_uid: expense.uid,
      user: {
        uid: "usr-004",
        full_name: "John Smith",
        email: "john.smith@example.com",
        avatar_url: { uid: "", original_name: undefined, public_url: undefined }
      },
      amount: 125.0,
      receiver_amount: 0,
      deleted: "ACTIVE",
    },
  ];

  // Mock attachments
  const attachments = [
    {
      uid: "att-1",
      name: "receipt_restaurant.jpg",
      url: "#",
      type: "image",
      size: "2.4 MB",
      uploaded_at: "2024-03-15T14:30:00Z",
    },
    {
      uid: "att-2",
      name: "invoice.pdf",
      url: "#",
      type: "pdf",
      size: "1.1 MB",
      uploaded_at: "2024-03-15T14:35:00Z",
    },
  ];

  const totalShares = userShares.reduce((sum, share) => sum + share.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{expense.name}</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Expense ID: {expense.uid}
              </p>
            </div>
            <Badge variant="secondary" className={getStatusColor(expense.status)}>
              {expense.status}
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
                    {formatCurrency(expense.total_amount, expense.currency)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {getSplitTypeLabel(expense.split_type)}
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
                    <p className="font-semibold">{expense.paid_by.full_name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{expense.paid_by.email}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-gray-600">Created By</p>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="size-7">
                      {expense.creator.avatar_url?.public_url ? (
                        <AvatarImage src={expense.creator.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(expense.creator.uid)} text-white font-semibold`}
                        >
                          {expense.creator.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p className="font-semibold">{expense.creator.full_name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{expense.creator.email}</p>
                </div>

                {expense.category && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PieChart className="h-4 w-4 text-orange-600" />
                      <p className="text-sm text-gray-600">Category</p>
                    </div>
                    <p className="font-semibold">{expense.category}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-gray-600">Expense Date</p>
                  </div>
                  <p className="font-semibold">
                    {formatDate(expense.expense_date)}
                  </p>
                </div>

                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-rose-600" />
                    <p className="text-sm text-gray-600">Event</p>
                  </div>
                  <p className="font-semibold">{expense.event_name}</p>
                  <p className="text-sm text-gray-500">
                    Event ID: {expense.event_uid}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Created At</p>
                  </div>
                  <p className="font-semibold text-sm">
                    {formatDateTime(expense.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {expense.note && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-700">Note</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {expense.note}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="splits">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Split Type</p>
                  <p className="text-lg font-bold text-gray-900">
                    {getSplitTypeLabel(expense.split_type)}
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
                      key={share.uid}
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
                            {formatCurrency(share.amount, expense.currency)}
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
                    {formatCurrency(totalShares, expense.currency)}
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
                <Button size="sm" variant="outline">
                  <Receipt className="h-4 w-4 mr-2" />
                  Upload Receipt
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.uid}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          attachment.type === "image"
                            ? "bg-blue-100"
                            : "bg-red-100"
                        }`}
                      >
                        {attachment.type === "image" ? (
                          <Image
                            className={`h-6 w-6 ${
                              attachment.type === "image"
                                ? "text-blue-600"
                                : "text-red-600"
                            }`}
                          />
                        ) : (
                          <FileText
                            className={`h-6 w-6 ${
                              attachment.type === "image"
                                ? "text-blue-600"
                                : "text-red-600"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{attachment.name}</p>
                        <p className="text-sm text-gray-500">
                          {attachment.size} •{" "}
                          {formatDateTime(attachment.uploaded_at)}
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