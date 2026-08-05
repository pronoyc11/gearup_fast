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
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const visibleUsers = useMemo(
    () => users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase())),
    [users, search],
  );
  const pageCount = Math.max(1, Math.ceil(visibleUsers.length / pageSize));
  const paginatedUsers = visibleUsers.slice((page - 1) * pageSize, page * pageSize);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-4">
        <h2 className="font-black">Users</h2>
        <Input className="max-w-xs" placeholder="Search users" value={search} onChange={(event) => handleSearch(event.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>{paginatedUsers.map((user) => (
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm text-zinc-600">
        <span>Showing {paginatedUsers.length} of {visibleUsers.length} users</span>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button>
          <span className="flex min-h-11 items-center font-semibold">Page {page} of {pageCount}</span>
          <Button variant="secondary" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next</Button>
        </div>
      </div>
    </Card>
  );
}
