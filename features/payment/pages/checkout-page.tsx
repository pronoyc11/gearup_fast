"use client";

import { CreditCard } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCustomerRental } from "@/features/rental/hooks/use-rentals";
import { formatMoney } from "@/shared/utils/format";
import { useToastStore } from "@/stores/toast.store";
import { useCreateCheckoutSession } from "../hooks/use-payments";

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId") ?? undefined;
  const [error, setError] = useState("");
  const showToast = useToastStore((state) => state.showToast);
  const { data: order } = useCustomerRental(id);
  const createSession = useCreateCheckoutSession();
  const item = itemId ? order?.items.find((orderItem) => orderItem.id === itemId) : undefined;
  const canCheckout = itemId ? item?.status === "CONFIRMED" : order?.status === "CONFIRMED";

  async function handleCheckout() {
    try {
      const checkoutUrl = await createSession.mutateAsync({
        rentalOrderId: id,
        rentalOrderItemId: itemId,
      });
      if (!checkoutUrl) {
        setError("Checkout session created, but no redirect URL was returned.");
        showToast({
          title: "Checkout unavailable",
          description: "No redirect URL was returned.",
          variant: "error",
        });
        return;
      }
      showToast({ title: "Opening Stripe checkout", variant: "info" });
      window.location.href = checkoutUrl as string;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed.";
      setError(message);
      showToast({
        title: "Payment failed",
        description: message,
        variant: "error",
      });
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-66px)] max-w-2xl content-center px-4 py-10">
      <Card className="space-y-5 p-6">
        <div className="flex items-center gap-2">
          <CreditCard className="text-teal-700" />
          <h1 className="text-2xl font-black">Payment</h1>
        </div>
        <div className="rounded-md bg-zinc-50 p-4">
          <p className="text-sm text-zinc-500">{itemId ? "Order item" : "Order"}</p>
          <p className="font-bold">#{id.slice(0, 8)}</p>
          {itemId ? (
            <p className="mt-1 text-sm text-zinc-600">
              {item?.gear?.title ?? item?.gearId ?? itemId}
            </p>
          ) : null}
          <div className="mt-3 flex items-center justify-between">
            <StatusBadge value={itemId ? item?.status : order?.status} />
            <strong>{formatMoney(itemId ? item?.subtotal : order?.totalAmount)}</strong>
          </div>
        </div>
        {error ? (
          <p className="text-sm font-semibold text-red-700">{error}</p>
        ) : null}
        {!canCheckout ? (
          <p className="text-sm font-semibold text-amber-700">
            {itemId
              ? "This item can be paid once its provider confirms it."
              : "Full-order payment is available after every provider confirms every item."}
          </p>
        ) : null}
        <Button
          className="w-full"
          disabled={createSession.isPending || !canCheckout}
          onClick={handleCheckout}
        >
          {createSession.isPending
            ? "Opening Stripe..."
            : "Continue to Stripe Checkout"}
        </Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/dashboard/customer/orders/${id}`}>Back to Order</Link>
        </Button>
      </Card>
    </main>
  );
}
