"use client";

import { ClipboardList, PackagePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGears } from "@/features/gear/hooks/use-gears";
import { useProviderRentals } from "@/features/rental/hooks/use-rentals";
import { toArray } from "@/shared/api/response";
import { useAuthStore } from "@/stores/auth.store";
import { ProviderInventoryManager } from "../components/provider-inventory-manager";
import { ProviderStats } from "../components/provider-stats";

export default function ProviderDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: gear } = useGears({ limit: 100 });
  const { data: rentals } = useProviderRentals();
  const gears = toArray(gear).filter((item) => item.providerId === user?.id || item.provider?.id === user?.id);
  const rentalItems = toArray(rentals);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-black">Provider Dashboard</h1><p className="text-zinc-600">Manage inventory and fulfill incoming rental items.</p></div>
        <div className="flex gap-2">
          <Button asChild><Link href="/dashboard/provider/gear/new"><PackagePlus size={18} /> Add Gear</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/provider/orders"><ClipboardList size={18} /> Orders</Link></Button>
        </div>
      </header>
      <ProviderStats gears={gears} rentalItems={rentalItems} />
      <section>
        <h2 className="mb-4 text-xl font-black">Inventory</h2>
        <ProviderInventoryManager gears={gears} />
      </section>
    </main>
  );
}
