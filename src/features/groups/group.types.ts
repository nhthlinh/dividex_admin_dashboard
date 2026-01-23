import type { User } from "../users/user.types";

export interface Group {
  uid: string;
  name: string;
  leader: User;
  total_members: number;
  total_balance: number;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  avatar_url: {
    public_url: string;
  };
}
