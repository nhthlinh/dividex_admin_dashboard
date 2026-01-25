import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
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
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Calendar,
  CreditCard,
} from "lucide-react";
import type { Transaction } from "./transaction.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";

const transactionStats = [
  {
    icon: ArrowDownCircle,
    label: "Total Deposits",
    value: "$125,430",
    change: "+15% from last month",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: ArrowUpCircle,
    label: "Total Withdrawals",
    value: "$78,920",
    change: "+8% from last month",
    bgColor: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    icon: DollarSign,
    label: "Net Balance",
    value: "$46,510",
    change: "+28% from last month",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: TrendingUp,
    label: "Transactions",
    value: "1,234",
    change: "+12% from last month",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

const mockTransactions: Transaction[] = [
  {
    uid: "txn-001",
    type: "DEPOSIT",
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
    amount: 1000.0,
    currency: "USD",
    code: "DEP-20240315-001",
    created_at: "2024-03-15T10:30:00Z",
    status: "COMPLETED",
  },
  {
    uid: "txn-002",
    type: "WITHDRAW",
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
    amount: 500.0,
    currency: "USD",
    code: "WTH-20240315-002",
    created_at: "2024-03-15T11:45:00Z",
    status: "PENDING",
    bank_account: {
      uid: "bank-001",
      bank_name: "Vietcombank",
      account_number: "1234567890",
      account_holder: "Hana Ghoghly",
      branch: "Ha Noi Branch",
    },
  },
  {
    uid: "txn-003",
    type: "DEPOSIT",
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
    amount: 2500.0,
    currency: "USD",
    code: "DEP-20240316-003",
    created_at: "2024-03-16T09:15:00Z",
    status: "COMPLETED",
  },
  {
    uid: "txn-004",
    type: "WITHDRAW",
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
    amount: 750.0,
    currency: "USD",
    code: "WTH-20240316-004",
    created_at: "2024-03-16T14:20:00Z",
    status: "FAILED",
    bank_account: {
      uid: "bank-002",
      bank_name: "Techcombank",
      account_number: "9876543210",
      account_holder: "John Smith",
    },
  },
  {
    uid: "txn-005",
    type: "DEPOSIT",
    user: {
      uid: "usr-005",
      full_name: "Nguyễn Hồ Chi Vũ",
      email: "vu.nguyen@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    amount: 1500.0,
    currency: "VND",
    code: "DEP-20240317-005",
    created_at: "2024-03-17T08:30:00Z",
    status: "PENDING",
  },
  {
    uid: "txn-006",
    type: "WITHDRAW",
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
    amount: 300.0,
    currency: "USD",
    code: "WTH-20240317-006",
    created_at: "2024-03-17T16:45:00Z",
    status: "COMPLETED",
    bank_account: {
      uid: "bank-003",
      bank_name: "ACB Bank",
      account_number: "5555666677",
      account_holder: "Amy Roo",
    },
  },
  {
    uid: "txn-007",
    type: "DEPOSIT",
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
    amount: 3200.0,
    currency: "USD",
    code: "DEP-20240318-007",
    created_at: "2024-03-18T11:00:00Z",
    status: "COMPLETED",
  },
  {
    uid: "txn-008",
    type: "WITHDRAW",
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
    amount: 1200.0,
    currency: "USD",
    code: "WTH-20240318-008",
    created_at: "2024-03-18T15:30:00Z",
    status: "CANCELLED",
    bank_account: {
      uid: "bank-004",
      bank_name: "BIDV",
      account_number: "4444333322",
      account_holder: "Nguyễn Hồ Thúy Linh",
    },
  },
];

export function TransactionPage() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailDialogOpen(true);
  };

  const handleApprove = (transaction: Transaction) => {
    alert(`Approved transaction: ${transaction.code}`);
    setIsDetailDialogOpen(false);
  };

  const handleReject = (transaction: Transaction) => {
    alert(`Rejected transaction: ${transaction.code}`);
    setIsDetailDialogOpen(false);
  };

  const handleCancel = (transaction: Transaction) => {
    alert(`Cancelled transaction: ${transaction.code}`);
    setIsDetailDialogOpen(false);
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
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
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />;
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "FAILED":
        return <XCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <Ban className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.user.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "ALL" || transaction.type === filterType;
    const matchesStatus =
      filterStatus === "ALL" || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transaction Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all deposits and withdrawals
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {transactionStats.map((stat, index) => (
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

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-3 flex-1 justify-end">
              <div className="flex gap-2">
                <Button
                  variant={filterType === "ALL" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("ALL")}
                  className={
                    filterType === "ALL" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant={filterType === "DEPOSIT" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("DEPOSIT")}
                  className={
                    filterType === "DEPOSIT"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : ""
                  }
                >
                  <ArrowDownCircle className="h-4 w-4 mr-1" />
                  Deposits
                </Button>
                <Button
                  variant={filterType === "WITHDRAW" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("WITHDRAW")}
                  className={
                    filterType === "WITHDRAW"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : ""
                  }
                >
                  <ArrowUpCircle className="h-4 w-4 mr-1" />
                  Withdrawals
                </Button>
              </div>

              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by code or user..."
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
            {filteredTransactions.map((transaction) => (
              <Card
                key={transaction.uid}
                className="cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-rose-200"
                onClick={() => handleTransactionClick(transaction)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          transaction.type === "DEPOSIT"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "DEPOSIT" ? (
                          <ArrowDownCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <ArrowUpCircle className="h-6 w-6 text-red-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {transaction.type === "DEPOSIT"
                              ? "Deposit"
                              : "Withdrawal"}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(transaction.status)}
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(transaction.status)}
                              {transaction.status}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Code: {transaction.code}
                        </p>
                        <div className="flex flex-row items-center gap-6 text-sm">
                          <span className="text-gray-500">User: </span>
                          <div className="flex flex-row gap-3">
                            <Avatar className="size-7">
                              {transaction.user.avatar_url?.public_url ? (
                                <AvatarImage src={transaction.user.avatar_url.public_url} />
                              ) : (
                                <AvatarFallback
                                  className={`bg-gradient-to-br ${getAvatarGradient(transaction.user.uid)} text-white font-semibold`}
                                >
                                  {transaction.user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span className="font-medium">
                              {transaction.user.full_name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Date: </span>
                            <span className="font-medium">
                              {formatDateTime(transaction.created_at)}
                            </span>
                          </div>
                          {transaction.bank_account && (
                            <div>
                              <span className="text-gray-500">Bank: </span>
                              <span className="font-medium">
                                {transaction.bank_account.bank_name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${
                          transaction.type === "DEPOSIT"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "DEPOSIT" ? "+" : "-"}
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      {selectedTransaction && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p
                    className={`text-3xl font-bold ${
                      selectedTransaction.type === "DEPOSIT"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.type === "DEPOSIT" ? "+" : "-"}
                    {formatCurrency(
                      selectedTransaction.amount,
                      selectedTransaction.currency
                    )}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={getStatusColor(selectedTransaction.status)}
                >
                  <span className="flex items-center gap-1">
                    {getStatusIcon(selectedTransaction.status)}
                    {selectedTransaction.status}
                  </span>
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Transaction Code</p>
                  </div>
                  <p className="font-semibold">{selectedTransaction.code}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Created At</p>
                  </div>
                  <p className="font-semibold">
                    {formatDateTime(selectedTransaction.created_at)}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">User</p>
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="size-7">
                      {selectedTransaction.user.avatar_url?.public_url ? (
                        <AvatarImage src={selectedTransaction.user.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(selectedTransaction.user.uid)} text-white font-semibold`}
                        >
                          {selectedTransaction.user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p className="font-semibold">
                      {selectedTransaction.user.full_name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {selectedTransaction.user.email}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Type</p>
                  {selectedTransaction.type === 'DEPOSIT' ? (
                    <ArrowDownCircle className="h-4 w-4 inline-block mr-2" />
                  ) : (
                    <ArrowUpCircle className="h-4 w-4 inline-block mr-2" />
                  )}
                  <p className="font-semibold">{selectedTransaction.type}</p>
                </div>
              </div>

              {selectedTransaction.bank_account && (
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">Bank Account</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Bank Name</p>
                      <p className="font-semibold">
                        {selectedTransaction.bank_account.bank_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Number</p>
                      <p className="font-semibold">
                        {selectedTransaction.bank_account.account_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Holder</p>
                      <p className="font-semibold">
                        {selectedTransaction.bank_account.account_holder}
                      </p>
                    </div>
                    {selectedTransaction.bank_account.branch && (
                      <div>
                        <p className="text-xs text-gray-500">Branch</p>
                        <p className="font-semibold">
                          {selectedTransaction.bank_account.branch}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 flex-wrap">
              {selectedTransaction.status === "PENDING" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedTransaction)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedTransaction)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
              {(selectedTransaction.status === "COMPLETED" ||
                selectedTransaction.status === "PENDING") && (
                <Button
                  variant="outline"
                  onClick={() => handleCancel(selectedTransaction)}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Cancel Transaction
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
