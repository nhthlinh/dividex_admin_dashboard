import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

const users = [
  { id: "01", name: "Amy Roo", email: "", sales: "5.3k" },
  { id: "02", name: "Hana Ghoghly", email: "", sales: "3.3k" },
  { id: "03", name: "Nguyễn Hồ Thúy Linh", email: "", sales: "2.3k" },
  { id: "04", name: "Nguyễn Hồ Chi Vũ", email: "", sales: "1.3k" },
];

export function TopUser() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top User</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Sales</TableHead>
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
                    {user.sales}
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
