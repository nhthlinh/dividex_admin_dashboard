import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const users = [
  { id: "01", name: "Amy Roo", email: "amy.roo@example.com", balance: "5.3k" },
  { id: "02", name: "Hana Ghoghly", email: "hana.ghoghly@example.com", balance: "3.3k" },
  { id: "03", name: "Nguyễn Hồ Thúy Linh", email: "nguyen.linh@example.com", balance: "2.3k" },
  { id: "04", name: "Nguyễn Hồ Chi Vũ", email: "nguyen.vu@example.com", balance: "1.3k" },
  { id: "05", name: "John Doe", email: "john.doe@example.com", balance: "1.0k" },
  { id: "06", name: "Jane Smith", email: "jane.smith@example.com", balance: "900" },
];

export function TopUser() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top User</CardTitle>
        <Button 
          variant="link" className="text-sm px-0 mt-1"
          onClick={() => {
            window.location.href = "/user";
          }}
        >
          View all users
        </Button>
      </CardHeader>
      <CardContent>
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-slate-500">{user.id}</TableCell>
                <TableCell className="text-slate-900">{user.name}</TableCell>
                <TableCell className="text-slate-500">{user.email}</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="secondary" 
                    className="bg-purple-50 text-purple-600 hover:bg-purple-100"
                  >
                    {user.balance}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
