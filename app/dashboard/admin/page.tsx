"use client";

import { StatusBadge } from "@/components/status-badge";
import { api, listOf } from "@/lib/api";
import { UserStatus } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, UsersRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");
  const { data: users } = useQuery({ queryKey: ["admin-users"], queryFn: api.adminUsers });
  const { data: gear } = useQuery({ queryKey: ["admin-gear"], queryFn: api.adminGear });
  const { data: rentals } = useQuery({ queryKey: ["admin-rentals"], queryFn: api.adminRentals });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) => api.updateUserStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
  const createCategory = useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      setCategoryMessage("Category created.");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => setCategoryMessage(err.message),
  });
  const deleteCategory = useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
  const visibleUsers = useMemo(
    () => (users ?? []).filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())),
    [users, search],
  );

  function submitCategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    createCategory.mutate({ name: String(f.get("name")), description: String(f.get("description") || "") });
    e.currentTarget.reset();
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header>
        <div className="flex items-center gap-2"><Shield className="text-teal-700" /><h1 className="text-3xl font-black">Admin Dashboard</h1></div>
        <p className="text-zinc-600">Moderate users, categories, gear listings, and rental activity.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5"><UsersRound className="mb-3 text-teal-700" /><p className="text-sm text-zinc-500">Users</p><strong className="text-3xl">{users?.length ?? 0}</strong></div>
        <div className="panel p-5"><p className="text-sm text-zinc-500">Gear</p><strong className="text-3xl">{listOf(gear).length}</strong></div>
        <div className="panel p-5"><p className="text-sm text-zinc-500">Rentals</p><strong className="text-3xl">{listOf(rentals).length}</strong></div>
      </div>

      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-4">
          <h2 className="font-black">Users</h2>
          <input className="input max-w-xs" placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody>{visibleUsers.map((user) => (
              <tr key={user.id} className="border-b border-zinc-100">
                <td className="p-4"><p className="font-bold">{user.name}</p><p className="text-zinc-500">{user.email}</p></td>
                <td className="p-4">{user.role}</td>
                <td className="p-4"><StatusBadge value={user.status} /></td>
                <td className="p-4 text-right">
                  <button
                    className="btn btn-ghost"
                    onClick={() => updateStatus.mutate({ id: user.id, status: user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" })}
                  >
                    {user.status === "SUSPENDED" ? "Activate" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={submitCategory} className="panel space-y-3 p-5">
          <h2 className="font-black">Create Category</h2>
          <input required className="input" name="name" placeholder="Category name" />
          <textarea className="input" name="description" placeholder="Description" rows={3} />
          {categoryMessage ? <p className="text-sm font-semibold text-teal-800">{categoryMessage}</p> : null}
          <button className="btn btn-primary w-full">Create</button>
        </form>
        <div className="panel p-5">
          <h2 className="mb-3 font-black">Categories</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {categories?.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-md border border-zinc-200 p-3">
                <span className="font-semibold">{category.name}</span>
                <button className="text-sm font-bold text-red-700" onClick={() => deleteCategory.mutate(category.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="mb-3 font-black">Content Moderation</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase text-zinc-500">Gear Listings</h3>
            <div className="space-y-2">{listOf(gear).slice(0, 8).map((item) => <div key={item.id} className="flex justify-between rounded-md bg-zinc-50 p-3"><span>{item.title}</span><StatusBadge value={item.availability} /></div>)}</div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase text-zinc-500">Rental Orders</h3>
            <div className="space-y-2">{listOf(rentals).slice(0, 8).map((order) => <div key={order.id} className="flex justify-between rounded-md bg-zinc-50 p-3"><span>#{order.id.slice(0, 8)}</span><StatusBadge value={order.status} /></div>)}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
