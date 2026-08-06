"use client";

import { useParams } from "next/navigation";
import { useCancelRentalItem, useCustomerRental } from "@/features/rental/hooks/use-rentals";
import { useToastStore } from "@/stores/toast.store";
import { OrderDetailsCard } from "../components/order-details-card";

export default function CustomerOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useCustomerRental(id);
  const cancelRentalItem = useCancelRentalItem();
  const showToast = useToastStore((state) => state.showToast);

  function handleCancelItem(itemId: string) {
    const confirmed = window.confirm("Cancel this rental item?");
    if (!confirmed) return;

    cancelRentalItem.mutate(itemId, {
      onSuccess: () => showToast({ title: "Order item cancelled", variant: "success" }),
      onError: (cancelError) => showToast({ title: "Could not cancel item", description: cancelError.message, variant: "error" }),
    });
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="h-80 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="panel p-5 text-red-700">{error.message}</div>
      </main>
    );
  }

  if (!order) {
    return <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">Order not found.</main>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {cancelRentalItem.error ? <div className="panel mb-5 p-4 text-sm font-semibold text-red-700">{cancelRentalItem.error.message}</div> : null}
      <OrderDetailsCard order={order} onCancelItem={handleCancelItem} isCancellingItem={cancelRentalItem.isPending} />
    </main>
  );
}
