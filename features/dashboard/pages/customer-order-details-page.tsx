"use client";

import { useParams } from "next/navigation";
import { useCustomerRental } from "@/features/rental/hooks/use-rentals";
import { OrderDetailsCard } from "../components/order-details-card";

export default function CustomerOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useCustomerRental(id);

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
      <OrderDetailsCard order={order} />
    </main>
  );
}
