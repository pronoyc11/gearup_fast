"use client";

import { useCancelRental, useCustomerRentals } from "@/features/rental/hooks/use-rentals";
import { usePayments } from "@/features/payment/hooks/use-payments";
import { useToastStore } from "@/stores/toast.store";
import { CustomerOrders } from "../components/customer-orders";
import { CustomerStats } from "../components/customer-stats";
import { PaymentTable } from "../components/payment-table";

export default function CustomerDashboardPage() {
  const { data: orders, isLoading } = useCustomerRentals();
  const { data: payments } = usePayments();
  const cancelRental = useCancelRental();
  const showToast = useToastStore((state) => state.showToast);

  function handleCancel(orderId: string) {
    cancelRental.mutate(orderId, {
      onSuccess: () => showToast({ title: "Order cancelled", variant: "success" }),
      onError: (error) => showToast({ title: "Could not cancel order", description: error.message, variant: "error" }),
    });
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-black">Customer Dashboard</h1>
        <p className="text-zinc-600">Track rentals, pay confirmed orders, and review returned gear.</p>
      </header>
      <CustomerStats orders={orders} payments={payments} />
      {cancelRental.error ? <div className="panel p-4 text-sm font-semibold text-red-700">{cancelRental.error.message}</div> : null}
      {isLoading ? <div className="panel p-5">Loading orders...</div> : <CustomerOrders orders={orders} onCancel={handleCancel} isCancelling={cancelRental.isPending} />}
      <PaymentTable payments={payments} />
    </main>
  );
}
