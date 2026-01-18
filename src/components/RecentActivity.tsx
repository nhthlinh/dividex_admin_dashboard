import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

const activities = [
  {
    id: 1,
    user: "Olivia Martin",
    initials: "OM",
    action: "New sale",
    amount: "+$1,299.00",
    time: "2 minutes ago",
    status: "completed",
  },
  {
    id: 2,
    user: "Jackson Lee",
    initials: "JL",
    action: "New subscription",
    amount: "+$39.00",
    time: "10 minutes ago",
    status: "completed",
  },
  {
    id: 3,
    user: "Isabella Nguyen",
    initials: "IN",
    action: "New sale",
    amount: "+$299.00",
    time: "23 minutes ago",
    status: "completed",
  },
  {
    id: 4,
    user: "William Kim",
    initials: "WK",
    action: "Refund requested",
    amount: "-$99.00",
    time: "1 hour ago",
    status: "pending",
  },
  {
    id: 5,
    user: "Sofia Davis",
    initials: "SD",
    action: "New subscription",
    amount: "+$39.00",
    time: "2 hours ago",
    status: "completed",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar className="size-9">
            <AvatarFallback className="bg-slate-100 text-slate-600">
              {activity.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm text-slate-900">{activity.user}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">{activity.action}</p>
              <Badge 
                variant={activity.status === "completed" ? "default" : "secondary"}
                className="text-xs"
              >
                {activity.status}
              </Badge>
            </div>
          </div>
          <div className="text-sm text-slate-900">
            {activity.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
