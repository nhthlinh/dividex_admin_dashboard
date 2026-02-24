// NOT DONE
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Search,
  Calendar,
  CreditCard,
  ArrowLeftRight,
  LucideArrowDownUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";
import type { TransactionItem, TransactionStats } from "./transaction.types";
import { TransactionAPI } from "./transaction.api";
import { Spin } from "antd";

const PAGE_SIZE = 10;

export function TransactionPage() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "withdraw" | "deposit" | "transaction">("ALL");

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [stats, setStats] = useState<TransactionStats>();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);
 
  useEffect(() => {
    fetchTransactions();
  }, [page, filterType, searchQuery]);

  useEffect(() => {
    TransactionAPI.getTransactionStats().then(setStats);
  }, []);

  const transactionStats = stats
    ? [
        {
          label: "Total Deposits",
          value: stats.total_deposits,
          change: `${stats.percent_increase_deposits}%`,
          icon: ArrowDownCircle,
          bgColor: "bg-green-100",
          iconColor: "text-green-600",
        },
        {
          label: "Total Withdrawals",
          value: stats.total_withdrawals,
          change: `${stats.percent_increase_withdrawals}%`,
          icon: ArrowUpCircle,
          bgColor: "bg-red-100",
          iconColor: "text-red-600",
        },
        {
          label: "Total Transactions",
          value: stats.total_transactions,
          change: `${stats.percent_increase_transactions}%`,
          icon: TrendingUp,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
        },
      ]
    : [];

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await TransactionAPI.listTransactions({
        page,
        page_size: PAGE_SIZE,
        search: searchQuery,
        type: filterType === "ALL" ? undefined : filterType,
      });

      setTransactions(res.content);
      setTotal(res.total_rows);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionClick = (transaction: TransactionItem) => {
    setSelectedTransaction(transaction);
    setIsDetailDialogOpen(true);
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

  const TRANSACTION_UI = {
    deposit: {
      label: "Deposit",
      bg: "bg-green-100",
      text: "text-green-600",
      amountSign: "+",
      Icon: ArrowDownCircle,
    },
    withdraw: {
      label: "Withdrawal",
      bg: "bg-gray-100",
      text: "text-gray-600",
      amountSign: "-",
      Icon: ArrowUpCircle,
    },
    "transaction": {
      label: "In-app Transfer",
      bg: "bg-blue-100",
      text: "text-blue-600",
      amountSign: "", 
      Icon: ArrowLeftRight,
    },
  } as const;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.user.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "ALL" || transaction.type === filterType;
    return matchesSearch && matchesType;
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
      <Card className="border-0 shadow-sm p-5">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-3 flex-1 justify-end">
              <div className="flex gap-2">
                <Button
                  variant={filterType === "ALL" ? "default" : "outline"}
                  size="sm" 
                  onClick={() => setFilterType("ALL")}
                  className={
                    filterType === "ALL"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant={filterType === "deposit" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("deposit")}
                  className={
                    filterType === "deposit"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : ""
                  }
                >
                  <ArrowDownCircle className="h-4 w-4 mr-1" />
                  Deposits
                </Button>
                <Button
                  variant={filterType === "withdraw" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("withdraw")}
                  className={
                    filterType === "withdraw"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : ""
                  }
                >
                  <ArrowUpCircle className="h-4 w-4 mr-1" />
                  Withdrawals
                </Button>
                <Button
                  variant={filterType === "transaction" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("transaction")}
                  className={
                    filterType === "transaction"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : ""
                  }
                >
                  <LucideArrowDownUp className="h-4 w-4 mr-1" />
                  In-app
                </Button>
              </div>

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

        {filteredTransactions.map((transaction) => {
          const ui = TRANSACTION_UI[transaction.type];
          if (loading || !filteredTransactions) {
            return (
              <Card>
                <CardContent className="flex justify-center py-10">
                  <Spin />
                </CardContent>
              </Card>
            );
          }

          return (
            <Card
              key={transaction.uid}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-rose-200 mx-3"
              onClick={() => handleTransactionClick(transaction)}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${ui.bg}`}>
                      <ui.Icon className={`h-6 w-6 ${ui.text}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{ui.label}</h3>

                      <p className="text-sm text-gray-600 mb-2">
                        Code: {transaction.code}
                      </p>

                      <div className="flex flex-row items-center gap-6 text-sm">
                        <span className="text-gray-500">User:</span>

                        <div className="flex flex-row gap-3">
                          <Avatar className="size-7">
                            {transaction.user.avatar_url?.public_url ? (
                              <AvatarImage src={transaction.user.avatar_url.public_url} />
                            ) : (
                              <AvatarFallback
                                className={`bg-gradient-to-br ${getAvatarGradient(transaction.user.uid)} text-white font-semibold`}
                              >
                                {transaction.user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <span className="font-medium">
                            {transaction.user.full_name
                              .split(" ")
                              .slice(-2)
                              .join(" ")}
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

                        {transaction.type === "transaction" && transaction.to_user && (
                          <div>
                            <span className="text-gray-500">To: </span>
                            <span className="font-medium">
                              {transaction.to_user.full_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-2xl font-bold ${ui.text}`}>
                      {ui.amountSign}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Pagination */}
        <div className="flex items-center justify-between">
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
      </Card>

      {/* Transaction Detail Dialog */}
      {selectedTransaction && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>

            {(() => {
              const TRANSACTION_UI = {
                deposit: {
                  label: "Deposit",
                  text: "text-green-600",
                  amountSign: "+",
                  Icon: ArrowDownCircle,
                },
                withdraw: {
                  label: "Withdrawal",
                  text: "text-gray-600",
                  amountSign: "-",
                  Icon: ArrowUpCircle,
                },
                "transaction": {
                  label: "In-app Transfer",
                  text: "text-blue-600",
                  amountSign: "",
                  Icon: ArrowLeftRight,
                },
              } as const;

              const ui = TRANSACTION_UI[selectedTransaction.type];

              return (
                <div className="space-y-3">
                  {/* Amount */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Amount</p>
                      <p className={`text-3xl font-bold ${ui.text}`}>
                        {ui.amountSign}
                        {formatCurrency(
                          selectedTransaction.amount,
                          selectedTransaction.currency
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Code */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4 text-gray-600" />
                        <p className="text-sm text-gray-600">Transaction Code</p>
                      </div>
                      <p className="font-semibold">{selectedTransaction.code}</p>
                    </div>

                    {/* Created At */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <p className="text-sm text-gray-600">Created At</p>
                      </div>
                      <p className="font-semibold">
                        {formatDateTime(selectedTransaction.created_at)}
                      </p>
                    </div>

                    {/* User */}
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">User</p>
                      <div className="flex items-center gap-3 mb-1">
                        <Avatar className="size-7">
                          {selectedTransaction.user.avatar_url?.public_url ? (
                            <AvatarImage
                              src={selectedTransaction.user.avatar_url.public_url}
                            />
                          ) : (
                            <AvatarFallback
                              className={`bg-gradient-to-br ${getAvatarGradient(
                                selectedTransaction.user.uid
                              )} text-white font-semibold`}
                            >
                              {selectedTransaction.user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
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

                    {/* Type */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Type</p>
                      <ui.Icon className="h-4 w-4 inline-block mr-2" />
                      <p className="font-semibold">{ui.label}</p>
                    </div>
                  </div>

                  {/* In-app: To User */}
                  {selectedTransaction.type === "transaction" &&
                    selectedTransaction.to_user && (
                      <div className="p-4 bg-indigo-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">To User</p>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-7">
                            {selectedTransaction.to_user.avatar_url?.public_url ? (
                              <AvatarImage
                                src={
                                  selectedTransaction.to_user.avatar_url.public_url
                                }
                              />
                            ) : (
                              <AvatarFallback
                                className={`bg-gradient-to-br ${getAvatarGradient(
                                  selectedTransaction.to_user.uid
                                )} text-white font-semibold`}
                              >
                                {selectedTransaction.to_user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {selectedTransaction.to_user.full_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {selectedTransaction.to_user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Bank account (nếu có) */}
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
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}