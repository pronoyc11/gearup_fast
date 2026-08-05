"use client";

import { ClipboardList } from "lucide-react";
import { useProviderRentals, useUpdateRentalItem } from "@/features/rental/hooks/use-rentals";
import type { RentalStatus } from "@/features/rental/types/rental.types";
import { toArray } from "@/shared/api/response";
import { useToastStore } from "@/stores/toast.store";
import { ProviderOrdersTable } from "../components/provider-orders-table";

export default function ProviderOrdersPage() {
  const { data, isLoading } = useProviderRentals();
  const updateItem = useUpdateRentalItem();
  const showToast = useToastStore((state) => state.showToast);
  const rentalItems = toArray(data);
  function handleUpdate(itemId: string, status: RentalStatus) {
    updateItem.mutate(
      { itemId, status },
      {
        onSuccess: () => showToast({ title: "Order item updated", variant: "success" }),
        onError: (error) => showToast({ title: "Could not update order", description: error.message, variant: "error" }),
      },
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <div className="flex items-center gap-2"><ClipboardList className="text-teal-700" /><h1 className="text-3xl font-black">Incoming Orders</h1></div>
        <p className="text-zinc-600">Confirm placed items, mark paid items picked up, and close returned rentals.</p>
      </header>
      {updateItem.error ? <div className="panel p-4 text-sm font-semibold text-red-700">{updateItem.error.message}</div> : null}
      {isLoading ? <div className="panel p-5">Loading orders...</div> : (
        <ProviderOrdersTable items={rentalItems} isUpdating={updateItem.isPending} onUpdate={handleUpdate} />
      )}
    </main>
  );
}
