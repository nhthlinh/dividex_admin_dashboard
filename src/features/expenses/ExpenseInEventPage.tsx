import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

import {
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Receipt,
  PieChart,
} from "lucide-react";
import type { Expense } from "./expense.types";
import { ExpenseDetailDialog } from "./ExpenseDetailDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { getAvatarGradient } from "../../components/Header";
import { router } from "../../app/router";

const expenseStats = [
  {
    icon: DollarSign,
    label: "Total Expenses",
    value: "$45,230",
    change: "+22% from last month",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    icon: Receipt,
    label: "Active Expenses",
    value: "156",
    change: "+18% from last month",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: TrendingUp,
    label: "Settled Expenses",
    value: "89",
    change: "+12% from last month",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: PieChart,
    label: "Avg per Expense",
    value: "$290",
    change: "+8% from last month",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

const mockExpenses: Expense[] = [
  {
    uid: "exp-001",
    name: "Team Dinner at Restaurant",
    event_uid: "evt-001",
    event_name: "Team Building 2024",
    currency: "USD",
    total_amount: 500.0,
    paid_by: {
      uid: "usr-001",
      full_name: "Amy Roo",
      email: "amy.roo@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    creator: {
      uid: "usr-001",
      full_name: "Amy Roo",
      email: "amy.roo@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    split_type: "EQUAL",
    note: "Team dinner after the team building activities. Great food and conversation!",
    category: "Food & Dining",
    expense_date: "2024-03-15T19:30:00Z",
    status: "ACTIVE",
    created_at: "2024-03-15T20:00:00Z",
    updated_at: "2024-03-15T20:00:00Z",
  },
  {
    uid: "exp-002",
    name: "Hotel Accommodation",
    event_uid: "evt-001",
    event_name: "Team Building 2024",
    currency: "USD",
    total_amount: 1200.0,
    paid_by: {
      uid: "usr-002",
      full_name: "Hana Ghoghly",
      email: "hana.g@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    creator: {
      uid: "usr-002",
      full_name: "Hana Ghoghly",
      email: "hana.g@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    split_type: "EQUAL",
    note: "3 nights accommodation for 4 people at Mountain View Resort",
    category: "Accommodation",
    expense_date: "2024-03-14T15:00:00Z",
    status: "SETTLED",
    created_at: "2024-03-14T16:00:00Z",
    updated_at: "2024-03-18T10:00:00Z",
  },
  {
    uid: "exp-003",
    name: "Transportation & Gas",
    event_uid: "evt-001",
    event_name: "Team Building 2024",
    currency: "USD",
    total_amount: 180.0,
    paid_by: {
      uid: "usr-003",
      full_name: "Nguyễn Hồ Thúy Linh",
      email: "linh.nguyen@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    creator: {
      uid: "usr-003",
      full_name: "Nguyễn Hồ Thúy Linh",
      email: "linh.nguyen@example.com",
      avatar_url: {
        uid: "",
        original_name: undefined,
        public_url: undefined
      }
    },
    split_type: "EQUAL",
    note: "Gas and toll fees for the road trip",
    category: "Transportation",
    expense_date: "2024-03-14T09:00:00Z",
    status: "ACTIVE",
    created_at: "2024-03-14T18:00:00Z",
    updated_at: "2024-03-14T18:00:00Z",
  },
];

const event = {
    uid: "evt-001",
    name: "Team Building 2024",
    description: "Annual team building event for all company employees.",
    start_date: "2024-03-14T08:00:00Z",
}

const PAGE_SIZE = 2;

export function ExpenseInEventPage() {
  const eventId = router.state.location.pathname.split("/").pop();
  console.log("Event ID from URL:", eventId);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const [page, setPage] = useState(1);
  const [total] = useState(mockExpenses.length);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  };

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

  const getCategoryColor = (category: string | undefined) => {
    if (!category) return "bg-gray-100 text-gray-700";
    
    const colors: Record<string, string> = {
      "Food & Dining": "bg-orange-100 text-orange-700",
      "Accommodation": "bg-purple-100 text-purple-700",
      "Transportation": "bg-blue-100 text-blue-700",
      "Office Supplies": "bg-green-100 text-green-700",
      "Marketing": "bg-pink-100 text-rose-700",
      "Software & Tools": "bg-indigo-100 text-indigo-700",
    };
    
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  // Get unique categories
  const categories = Array.from(
    new Set(mockExpenses.map((exp) => exp.category).filter(Boolean))
  );

  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesSearch = expense.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || expense.status === filterStatus;
    const matchesCategory =
      filterCategory === "ALL" || expense.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expense Management for {event.name}</h1>
        </div>
        <div className="flex gap-3">
          <Button size="sm" className="text-white bg-rose-600 hover:bg-rose-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {expenseStats.map((stat, index) => (
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
                  variant={filterStatus === "SETTLED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("SETTLED")}
                  className={
                    filterStatus === "SETTLED"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : ""
                  }
                >
                  Settled
                </Button>
              </div>
              
              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search expenses..."
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
            {filteredExpenses.map((expense) => (
              <Card
                key={expense.uid}
                className="cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-rose-300"
                onClick={() => handleExpenseClick(expense)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg">
                        <Receipt className="h-6 w-6 text-rose-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {expense.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(expense.status)}
                          >
                            {expense.status}
                          </Badge>
                          {expense.category && (
                            <Badge
                              variant="secondary"
                              className={getCategoryColor(expense.category)}
                            >
                              {expense.category}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-2">
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="font-semibold text-rose-600">
                              {formatCurrency(
                                expense.total_amount,
                                expense.currency
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Paid By</p>
                            <div className="flex items-center gap-1">
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
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Event</p>
                            <p className="font-semibold text-sm truncate">
                              {expense.event_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold text-sm">
                              {formatDate(expense.expense_date)}
                            </p>
                          </div>
                        </div>

                        {expense.note && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {expense.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className="text-xs font-normal mb-2"
                      >
                        {expense.split_type}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        ID: {expense.uid}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No expenses found</p>
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

      <ExpenseDetailDialog
        expense={selectedExpense}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
