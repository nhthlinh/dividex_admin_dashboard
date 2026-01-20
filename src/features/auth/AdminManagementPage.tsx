import { Mail, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";


const admins = [
  { email: "admin1@gmail.com", role: "Super Admin", status: "active" },
  { email: "admin2@gmail.com", role: "Admin", status: "active" },
  { email: "admin3@gmail.com", role: "Admin", status: "invited" },
];

export function AdminManagementPage() {
  return (
    <div className="space-y-6">
      {/* Invite admin */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input placeholder="Enter admin email" type="email" />
            <Button className="bg-gradient-to-r from-rose-700 to-rose-600 text-white">
              <UserPlus className="size-4 mr-2" />
              Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin list */}
      <Card>
        <CardHeader>
          <CardTitle>Admin List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {admins.map((admin, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-slate-500" />
                  <div>
                    <div className="text-sm font-medium">{admin.email}</div>
                    <div className="text-xs text-slate-500">
                      {admin.role}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    admin.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {admin.status === "active" ? "Active" : "Invited"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
