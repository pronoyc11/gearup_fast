"use client";

import { GearCard } from "@/components/gear-card";
import { api, listOf } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, PackagePlus } from "lucide-react";
import Link from "next/link";

export default function ProviderDashboard() {
  const { data: gear } = useQuery({ queryKey: ["provider-gear"], queryFn: () => api.gear({ limit: 100 }) });
  const { data: rentals } = useQuery({ queryKey: ["provider-rentals"], queryFn: api.providerRentals });
  const items = listOf(rentals).flatMap((order) => order.items ?? []);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-black">Provider Dashboard</h1><p className="text-zinc-600">Manage inventory and fulfill incoming rental items.</p></div>
        <div className="flex gap-2"><Link className="btn btn-primary" href="/dashboard/provider/gear/new"><PackagePlus size={18} /> Add Gear</Link><Link className="btn btn-ghost" href="/dashboard/provider/orders"><ClipboardList size={18} /> Orders</Link></div>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5"><p className="text-sm text-zinc-500">Listed gear</p><strong className="text-3xl">{listOf(gear).length}</strong></div>
        <div className="panel p-5"><p className="text-sm text-zinc-500">Incoming items</p><strong className="text-3xl">{items.length}</strong></div>
        <div className="panel p-5"><p className="text-sm text-zinc-500">Pending confirmation</p><strong className="text-3xl">{items.filter((i) => i.status === "PLACED").length}</strong></div>
      </div>
      <section>
        <h2 className="mb-4 text-xl font-black">Inventory</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{listOf(gear).map((item) => <GearCard key={item.id} gear={item} />)}</div>
      </section>
    </main>
  );
}
