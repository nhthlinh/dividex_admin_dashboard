import { useState, type SetStateAction } from "react";
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
  AlertTriangle,
  Search,
  TrendingUp,
  Activity,
  XCircle,
  AlertCircle,
  Info,
  Clock,
  User,
  Globe,
  Code,
  Database,
  RefreshCw,
  Calendar,
} from "lucide-react";
import type { HttpMethod, LogLevel, SystemLog } from "./systemLog.types";

const errorStats = [
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
    icon: AlertCircle,
    label: "Critical Errors",
    value: "8",
    change: "-20% from last week",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
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
];

const mockSystemLogs: SystemLog[] = [
  {
    uid: "log-001",
    api_endpoint: "/api/v1/expenses/create",
    http_method: "POST",
    status_code: 500,
    error_message: "Internal Server Error: Database connection timeout",
    error_type: "DatabaseConnectionError",
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
    ip_address: "192.168.1.105",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    request_body: {
      name: "Team Dinner",
      amount: 500.0,
      currency: "USD",
      event_uid: "evt-001",
    },
    response_body: {
      error: "Database connection timeout after 30000ms",
      code: "DB_TIMEOUT",
    },
    stack_trace: `Traceback (most recent call last):
  File "/app/api/expenses.py", line 45, in create_expense
    expense = Expense.objects.create(**data)
  File "/usr/local/lib/python3.9/site-packages/django/db/models/manager.py", line 85, in manager_method
    return getattr(self.get_queryset(), name)(*args, **kwargs)
  File "/usr/local/lib/python3.9/site-packages/django/db/models/query.py", line 447, in create
    obj.save(force_insert=True, using=self.db)
psycopg2.OperationalError: could not connect to server: Connection timed out`,
    execution_time: 30245,
    timestamp: "2024-02-03T10:35:42Z",
    log_level: "ERROR",
  },
  {
    uid: "log-002",
    api_endpoint: "/api/v1/users/update",
    http_method: "PUT",
    status_code: 400,
    error_message: "Bad Request: Invalid email format",
    error_type: "ValidationError",
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
    ip_address: "192.168.1.108",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    request_body: {
      email: "invalid-email-format",
      name: "Hana Updated",
    },
    response_body: {
      error: "Email format is invalid",
      field: "email",
      code: "VALIDATION_ERROR",
    },
    stack_trace: `ValidationError at /api/v1/users/update
Invalid email format provided
  File "/app/api/users.py", line 78, in update_user
    validate_email(data['email'])
  File "/app/utils/validators.py", line 12, in validate_email
    raise ValidationError("Email format is invalid")`,
    execution_time: 125,
    timestamp: "2024-02-03T09:22:15Z",
    log_level: "WARNING",
  },
  {
    uid: "log-003",
    api_endpoint: "/api/v1/groups/delete",
    http_method: "DELETE",
    status_code: 403,
    error_message: "Forbidden: User does not have permission to delete this group",
    error_type: "PermissionDenied",
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
    ip_address: "192.168.1.112",
    user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
    request_body: {
      group_uid: "grp-005",
    },
    response_body: {
      error: "User is not the group leader",
      code: "PERMISSION_DENIED",
    },
    stack_trace: `PermissionDenied at /api/v1/groups/delete
User does not have permission to delete this group
  File "/app/api/groups.py", line 156, in delete_group
    if request.user.uid != group.leader.uid:
      raise PermissionDenied("User is not the group leader")`,
    execution_time: 89,
    timestamp: "2024-02-03T08:45:30Z",
    log_level: "WARNING",
  },
  {
    uid: "log-004",
    api_endpoint: "/api/v1/transactions/withdraw",
    http_method: "POST",
    status_code: 500,
    error_message: "Critical Error: Payment gateway connection failed",
    error_type: "PaymentGatewayError",
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
    ip_address: "192.168.1.120",
    user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    request_body: {
      amount: 1000.0,
      bank_account_uid: "bank-001",
    },
    response_body: {
      error: "Payment gateway API returned 503 Service Unavailable",
      code: "GATEWAY_ERROR",
    },
    stack_trace: `PaymentGatewayError at /api/v1/transactions/withdraw
Payment gateway connection failed
  File "/app/api/transactions.py", line 201, in process_withdraw
    response = payment_gateway.withdraw(amount, account)
  File "/app/services/payment.py", line 45, in withdraw
    raise PaymentGatewayError("Gateway API unavailable")`,
    execution_time: 5234,
    timestamp: "2024-02-03T07:15:22Z",
    log_level: "CRITICAL",
  },
  {
    uid: "log-005",
    api_endpoint: "/api/v1/events/list",
    http_method: "GET",
    status_code: 404,
    error_message: "Not Found: Event with uid 'evt-999' does not exist",
    error_type: "NotFoundError",
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
    ip_address: "192.168.1.125",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    request_body: null,
    response_body: {
      error: "Event not found in database",
      code: "NOT_FOUND",
    },
    stack_trace: `NotFoundError at /api/v1/events/list
Event does not exist
  File "/app/api/events.py", line 92, in get_event
    event = Event.objects.get(uid=event_uid)
  File "/usr/local/lib/python3.9/site-packages/django/db/models/query.py", line 431, in get
    raise self.model.DoesNotExist`,
    execution_time: 45,
    timestamp: "2024-02-03T06:30:18Z",
    log_level: "INFO",
  },
  {
    uid: "log-006",
    api_endpoint: "/api/v1/notifications/send",
    http_method: "POST",
    status_code: 500,
    error_message: "Internal Server Error: Redis cache connection lost",
    error_type: "CacheConnectionError",
    user: {
        uid: "admin-001",
        full_name: "System Admin",
        email: "admin@dividex.com",
        avatar_url: {
            uid: "",
            original_name: undefined,
            public_url: undefined
        }
    },
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    request_body: {
      content: "System maintenance notification",
      type: "ANNOUNCEMENT",
      is_broadcast: true,
    },
    response_body: {
      error: "Failed to connect to Redis cache server",
      code: "CACHE_ERROR",
    },
    stack_trace: `CacheConnectionError at /api/v1/notifications/send
Redis connection lost
  File "/app/api/notifications.py", line 67, in send_notification
    cache.set(cache_key, notification_data)
  File "/usr/local/lib/python3.9/site-packages/redis/client.py", line 1547, in set
    return self.execute_command('SET', *pieces)
redis.exceptions.ConnectionError: Error connecting to Redis`,
    execution_time: 10567,
    timestamp: "2024-02-03T05:12:05Z",
    log_level: "ERROR",
  },
  {
    uid: "log-007",
    api_endpoint: "/api/v1/messages/create",
    http_method: "POST",
    status_code: 413,
    error_message: "Payload Too Large: Attachment size exceeds 10MB limit",
    error_type: "FileSizeError",
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
    ip_address: "192.168.1.108",
    user_agent: "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)",
    request_body: {
      content: "Here's the presentation file",
      group_uid: "grp-001",
      attachment_size: 15728640,
    },
    response_body: {
      error: "File size exceeds maximum allowed size of 10MB",
      max_size: "10MB",
      actual_size: "15MB",
      code: "FILE_TOO_LARGE",
    },
    execution_time: 234,
    timestamp: "2024-02-03T04:55:40Z",
    log_level: "WARNING",
  },
  {
    uid: "log-008",
    api_endpoint: "/api/v1/auth/login",
    http_method: "POST",
    status_code: 401,
    error_message: "Unauthorized: Invalid credentials",
    error_type: "AuthenticationError",
    user: undefined,
    ip_address: "192.168.1.150",
    user_agent: "Mozilla/5.0 (Android 13; Mobile)",
    request_body: {
      email: "unknown@example.com",
      password: "********",
    },
    response_body: {
      error: "Email or password is incorrect",
      code: "INVALID_CREDENTIALS",
    },
    execution_time: 567,
    timestamp: "2024-02-03T03:20:12Z",
    log_level: "WARNING",
  },
];

export function SystemLogPage() {
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<string>("ALL");
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const handleLogClick = (log: SystemLog) => {
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

  const getLevelColor = (level: LogLevel) => {
    const colors: Record<LogLevel, string> = {
      INFO: "bg-blue-100 text-blue-800",
      WARNING: "bg-yellow-100 text-yellow-800",
      ERROR: "bg-red-100 text-red-800",
      CRITICAL: "bg-purple-100 text-purple-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const getLevelIcon = (level: LogLevel) => {
    const icons: Record<LogLevel, React.ElementType> = {
      INFO: Info,
      WARNING: AlertTriangle,
      ERROR: XCircle,
      CRITICAL: AlertCircle,
    };
    const Icon = icons[level] || Info;
    return <Icon className="h-4 w-4" />;
  };

  const filteredLogs = mockSystemLogs.filter((log) => {
    const matchesSearch =
      log.api_endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.error_message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod =
      filterMethod === "ALL" || log.http_method === filterMethod;
    const matchesLevel = filterLevel === "ALL" || log.log_level === filterLevel;
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "2xx" && log.status_code >= 200 && log.status_code < 300) ||
      (filterStatus === "4xx" && log.status_code >= 400 && log.status_code < 500) ||
      (filterStatus === "5xx" && log.status_code >= 500);
    return matchesSearch && matchesMethod && matchesLevel && matchesStatus;
  });

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
        {errorStats.map((stat, index) => (
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
            <CardTitle>API Call Logs</CardTitle>
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

              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="ALL">All Levels</option>
                <option value="INFO">Info</option>
                <option value="WARNING">Warning</option>
                <option value="ERROR">Error</option>
                <option value="CRITICAL">Critical</option>
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
                    Error
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.uid}
                    className="hover:bg-pink-50 cursor-pointer transition-colors"
                    onClick={() => handleLogClick(log)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={getMethodColor(log.http_method)}
                      >
                        {log.http_method}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-blue-600">
                      {log.api_endpoint}
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
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.error_message || "-"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={getLevelColor(log.log_level)}
                      >
                        <span className="flex items-center gap-1">
                          {getLevelIcon(log.log_level)}
                          {log.log_level}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.execution_time}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No logs found</p>
            </div>
          )}
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
              <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className={getMethodColor(selectedLog.http_method)}
                      >
                        {selectedLog.http_method}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(selectedLog.status_code)}
                      >
                        {selectedLog.status_code}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getLevelColor(selectedLog.log_level)}
                      >
                        <span className="flex items-center gap-1">
                          {getLevelIcon(selectedLog.log_level)}
                          {selectedLog.log_level}
                        </span>
                      </Badge>
                    </div>
                    <p className="font-mono text-sm text-blue-600 mb-2">
                      {selectedLog.api_endpoint}
                    </p>
                    <p className="text-red-700 font-semibold">
                      {selectedLog.error_message}
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
                  <p className="font-semibold">{formatDateTime(selectedLog.timestamp)}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Execution Time</p>
                  </div>
                  <p className="font-semibold">{selectedLog.execution_time}ms</p>
                </div>

                {selectedLog.user && (
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
                )}

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-gray-600">IP Address</p>
                  </div>
                  <p className="font-semibold">{selectedLog.ip_address}</p>
                </div>

                {selectedLog.error_type && (
                  <div className="col-span-2 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-orange-600" />
                      <p className="text-sm text-gray-600">Error Type</p>
                    </div>
                    <p className="font-semibold text-orange-700">
                      {selectedLog.error_type}
                    </p>
                  </div>
                )}
              </div>

              {/* User Agent */}
              {selectedLog.user_agent && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">User Agent</p>
                  <p className="text-sm font-mono text-gray-700">
                    {selectedLog.user_agent}
                  </p>
                </div>
              )}

              {/* Request Body */}
              {selectedLog.request_body && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-700">Request Body</p>
                  </div>
                  <pre className="text-xs bg-white p-3 rounded border border-blue-200 overflow-x-auto">
                    {JSON.stringify(selectedLog.request_body, null, 2)}
                  </pre>
                </div>
              )}

              {/* Response Body */}
              {selectedLog.response_body && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-semibold text-gray-700">Response Body</p>
                  </div>
                  <pre className="text-xs bg-white p-3 rounded border border-red-200 overflow-x-auto">
                    {JSON.stringify(selectedLog.response_body, null, 2)}
                  </pre>
                </div>
              )}

              {/* Stack Trace */}
              {selectedLog.stack_trace && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="h-4 w-4 text-gray-600" />
                    <p className="text-sm font-semibold text-gray-700">Stack Trace</p>
                  </div>
                  <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded overflow-x-auto font-mono">
                    {selectedLog.stack_trace}
                  </pre>
                </div>
              )}
            </div>

            <DialogFooter>
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
