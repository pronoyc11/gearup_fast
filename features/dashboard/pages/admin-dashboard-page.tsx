"use client";

import { Shield } from "lucide-react";
import { CategoryForm } from "@/features/category/components/category-form";
import { CategoryList } from "@/features/category/components/category-list";
import { toArray } from "@/shared/api/response";
import { AdminStats } from "../components/admin-stats";
import { AdminUserTable } from "../components/admin-user-table";
import { ModerationPanel } from "../components/moderation-panel";
import { useAdminGear, useAdminRentals, useAdminUsers, useUpdateUserStatus } from "../hooks/use-admin-dashboard";

export default function AdminDashboardPage() {
  const { data: users } = useAdminUsers();
  const { data: gear } = useAdminGear();
  const { data: rentals } = useAdminRentals();
  const updateUser = useUpdateUserStatus();
  const gears = toArray(gear);
  const rentalOrders = toArray(rentals);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header>
        <div className="flex items-center gap-2"><Shield className="text-teal-700" /><h1 className="text-3xl font-black">Admin Dashboard</h1></div>
        <p className="text-zinc-600">Moderate users, categories, gear listings, and rental activity.</p>
      </header>
      <AdminStats usersCount={users?.length ?? 0} gearCount={gears.length} rentalCount={rentalOrders.length} />
      <AdminUserTable users={users} onStatusChange={(userId, status) => updateUser.mutate({ userId, status })} />
      <section className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <CategoryForm />
        <CategoryList />
      </section>
      <ModerationPanel gears={gears} rentals={rentalOrders} />
    </main>
  );
}
