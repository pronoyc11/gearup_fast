"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { User, UserStatus } from "@/features/auth/types/auth.types";

type Props = {
  users?: User[];
  onStatusChange: (userId: string, status: UserStatus) => void;
};

export function AdminUserTable({ users = [], onStatusChange }: Props) {
  const [search, setSearch] = useState("");
  const visibleUsers = useMemo(
    () => users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase())),
    [users, search],
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-4">
        <h2 className="font-black">Users</h2>
        <Input className="max-w-xs" placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>{visibleUsers.map((user) => (
            <tr key={user.id} className="border-b border-zinc-100">
              <td className="p-4"><p className="font-bold">{user.name}</p><p className="text-zinc-500">{user.email}</p></td>
              <td className="p-4">{user.role}</td>
              <td className="p-4"><StatusBadge value={user.status} /></td>
              <td className="p-4 text-right">
                <Button variant="secondary" onClick={() => onStatusChange(user.id, user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED")}>
                  {user.status === "SUSPENDED" ? "Activate" : "Suspend"}
                </Button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Card>
  );
}
