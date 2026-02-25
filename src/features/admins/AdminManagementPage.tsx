// NOT DONE
import { useEffect, useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { AdminAPI } from "./admin.api";
import { message } from "antd";
import type { Admin } from "./admin.types";
import { Trash2 } from "lucide-react";
import { Popconfirm } from "antd";

export function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      const res = await AdminAPI.listAdmins({});
      setAdmins(res.content);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const handleInvite = async () => {
    if (!email) {
      message.warning("Please enter email");
      return;
    }

    try {
      setLoading(true);
      await AdminAPI.createAdmin({ email });
      message.success("Admin invited successfully");
      setEmail("");
      fetchAdmins();
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminUid: string) => {
    try {
      await AdminAPI.deleteAdmin(adminUid);
      message.success("Admin deleted");
      fetchAdmins();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const handleDeactivate = async (adminUid: string) => {
    try {
      await AdminAPI.deActivateAdmin(adminUid);
      message.success("Admin deactivated");
      fetchAdmins();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="space-y-6">
      {/* Invite admin */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter admin email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button
              onClick={handleInvite}
              disabled={loading}
              className="bg-gradient-to-r from-rose-700 to-rose-600 text-white"
            >
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
            {admins.map(admin => (
              <div
                key={admin.uid}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-slate-500" />
                  <div className="text-sm font-medium">{admin.email}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      admin.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {admin.status === "active" ? "Active" : "Invited"}
                  </span>

                  {admin.status === "active" && (
                    <Popconfirm
                      title="Deactivate admin"
                      description="Are you sure you want to deactivate this admin?"
                      okText="Deactivate"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDeactivate(admin.uid)}
                    >
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </Popconfirm>
                  )}

                  {admin.status === "invited" && (
                    <Popconfirm
                      title="Delete invitation"
                      description="Are you sure you want to remove this admin?"
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDelete(admin.uid)}
                    >
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </Popconfirm>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
