import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import type { User } from "../features/users/user.types";
import { UserAPI } from "../features/users/user.api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatarGradient } from "./Header";

export function TopUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const res = await UserAPI.listUsers({
          order_by: "balance",
          sort_type: "desc",
          page: 1,
          page_size: 15,
        });

        setUsers(res.content);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Users</CardTitle>
        <Button
          variant="link"
          className="text-sm px-0 mt-1"
          onClick={() => {
            window.location.href = "/user";
          }}
        >
          View all users
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.uid}>
                  <TableCell className="text-slate-500">
                    {index + 1}
                  </TableCell>

                  <TableCell className="text-slate-900 flex flex-row items-center gap-3">
                    <Avatar className="size-7">
                      {user.avatar_url?.public_url ? (
                        <AvatarImage src={user.avatar_url.public_url} />
                      ) : (
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(user.uid)} text-white font-semibold`}
                        >
                          {user.full_name.split(" ").map(n => n[0]).join("").split("").slice(0,2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {user.full_name}
                  </TableCell>

                  <TableCell className="text-slate-500">
                    {user.email}
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className="bg-purple-50 text-purple-600 hover:bg-purple-100"
                    >
                      {user.balance?.toLocaleString()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
