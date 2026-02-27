import { useEffect, useState, type SetStateAction } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertTriangle,
  Search,
  TrendingUp,
  Activity,
  XCircle,
  Clock,
  User,
  Globe,
  Code,
  RefreshCw,
  Calendar,
} from "lucide-react";
import type { HttpMethod, SystemLogItem } from "./systemLog.types";
import { SystemLogAPI } from "./systemLog.api";

const PAGE_SIZE = 20;

export function SystemLogPage() {
  const [selectedLog, setSelectedLog] = useState<SystemLogItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const [stats, setStats] = useState([
    {
      icon: AlertTriangle,
      label: "Total Errors",
      value: "1,234",
      change: "-5% from last week",
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
      trend: "down",
    },
    {
      icon: XCircle,
      label: "Errors Today",
      value: "42",
      change: "-12% from yesterday",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
      trend: "down",
    },
    {
      icon: Clock,
      label: "Avg Response Time",
      value: "245ms",
      change: "+8% from last week",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      trend: "up",
    },
  ]);

  const [systemLogs, setSystemLogs] = useState<SystemLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  
  const totalPages = Math.ceil(total / PAGE_SIZE);  

  useEffect(() => {
        const fetchStats = async () => {
      try {
        const statsData = await SystemLogAPI.getManagementLog();
        setStats([
          {
            icon: AlertTriangle,
            label: "Total Errors",
            value: statsData.total_errors.toLocaleString(),
            change: statsData.percent_increase_errors + "% from last month",
            bgColor: "bg-red-50",
            iconColor: "text-red-500",
            trend: statsData.percent_increase_errors >= 0 ? "up" : "down",
          },
          {
            icon: XCircle,
            label: "Errors Today",
            value: statsData.today_errors.toLocaleString(),
            change: statsData.percent_increase_today_errors + "% from yesterday",
            bgColor: "bg-orange-50",
            iconColor: "text-orange-500",
            trend: statsData.percent_increase_today_errors >= 0 ? "up" : "down",
          },
          {
            icon: Clock,
            label: "Avg Response Time",
            value: statsData.avg_response_time.toFixed(2) + "ms",
            change: statsData.percent_increase_avg_response_time.toFixed(2) + "% from last week",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-500",
            trend: statsData.percent_increase_avg_response_time >= 0 ? "up" : "down",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch system log stats:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchLogs = async (page: number) => {
      try {
        setLoading(true);
        const logsData = await SystemLogAPI.getLogs({
          page, page_size: PAGE_SIZE,
          method_type: filterMethod === "ALL" ? null : filterMethod as HttpMethod,
          status_code: filterStatus === "ALL" ? null : filterStatus as any,
          search: searchQuery || undefined
        });
        setSystemLogs(logsData.content);
        setTotal(logsData.total_rows);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch system logs:", error);
      }
    };
    fetchLogs(page);
  }, [page, filterMethod, filterStatus, searchQuery]);

  const handleLogClick = (log: SystemLogItem) => {
    setSelectedLog(log);
    setIsDetailDialogOpen(true);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return "bg-green-100 text-green-800";
    } else if (statusCode >= 400 && statusCode < 500) {
      return "bg-yellow-100 text-yellow-800";
    } else if (statusCode >= 500) {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getMethodColor = (method: HttpMethod) => {
    const colors: Record<HttpMethod, string> = {
      GET: "bg-blue-100 text-blue-800",
      POST: "bg-green-100 text-green-800",
      PUT: "bg-orange-100 text-orange-800",
      PATCH: "bg-purple-100 text-purple-800",
      DELETE: "bg-red-100 text-red-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">System Logs & Errors</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor API calls and system errors
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend === "down" ? (
                      <TrendingUp className="h-3 w-3 text-green-600 rotate-180" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={
                        stat.trend === "down" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>
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
              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <option value="ALL">All Methods</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>

              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="2xx">2xx Success</option>
                <option value="4xx">4xx Client Error</option>
                <option value="5xx">5xx Server Error</option>
              </select>

              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    API Endpoint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Response Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Loading logs...</p>
                    </td>
                  </tr>
                )}

                {systemLogs.map((log) => (
                  <tr
                    key={log.uid}
                    className="hover:bg-pink-50 cursor-pointer transition-colors"
                    onClick={() => handleLogClick(log)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={getMethodColor(log.method_type)}
                      >
                        {log.method_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-blue-600">
                      {log.path}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(log.status_code)}
                      >
                        {log.status_code}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {log.user ? (
                        <div>
                          <p className="font-medium text-gray-900">
                            {log.user.full_name}
                          </p>
                          <p className="text-xs text-gray-500">{log.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Anonymous</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.response_time.toFixed(5)} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {systemLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No logs found</p>
            </div>
          )}

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
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      {selectedLog && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Error Log Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Summary */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={getMethodColor(selectedLog.method_type)}
                      >
                        {selectedLog.method_type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(selectedLog.status_code)}
                      >
                        {selectedLog.status_code}
                      </Badge>
                    </div>
                    <p className="font-mono text-sm text-blue-600">
                      {selectedLog.path}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Timestamp</p>
                  </div>
                  <p className="font-semibold">{formatDateTime(selectedLog.created_at)}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Response Time</p>
                  </div>
                  <p className="font-semibold">{selectedLog.response_time.toFixed(5)}ms</p>
                </div>

                {selectedLog.user ? (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <p className="text-sm text-gray-600">User</p>
                    </div>
                    <p className="font-semibold">{selectedLog.user.full_name}</p>
                    <p className="text-sm text-gray-500">{selectedLog.user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      UID: {selectedLog.user.uid}
                    </p>
                  </div>
                )
                 : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-600">User</p>
                    </div>
                    <p className="font-semibold">Anonymous User</p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-gray-600">IP Address</p>
                  </div>
                  <p className="font-semibold">{parseLogMessage(selectedLog.log_message)?.ip_address || "Unknown"}</p>
                </div>

                {selectedLog.log_message && (
                  <div className="col-span-2 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-orange-600" />
                      <p className="text-sm text-gray-600">Log Message</p>
                    </div>
                    <p className="font-semibold text-orange-700">
                      {selectedLog.log_message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export interface ParsedLogMessage {
  response?: string;
  ip_address?: string;
  authenticator?: string;
  running_time?: number;
  query_count?: number;
}

export function parseLogMessage(log: string): ParsedLogMessage {
  const get = (regex: RegExp) => log.match(regex)?.[1];

  return {
    response: get(/Response:\s*(.+)/),
    ip_address: get(/IP Address:\s*([^\n]+)/),
    authenticator: get(/Authenticator:\s*([^\n]+)/),
    running_time: Number(get(/Running time:\s*([0-9.]+)/)),
    query_count: Number(get(/Number of queries:\s*(\d+)/)),
  };
}
