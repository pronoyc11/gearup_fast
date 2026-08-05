"use client";

import { CreditCard } from "lucide-react";
import { useParams } from "next/navigation";
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
  const [error, setError] = useState("");
  const showToast = useToastStore((state) => state.showToast);
  const { data: order } = useCustomerRental(id);
  const createSession = useCreateCheckoutSession();

  async function handleCheckout() {
    try {
      const session = await createSession.mutateAsync(id);
      const checkoutUrl = session.url ?? session.sessionUrl;
      if (!checkoutUrl) {
        setError("Checkout session created, but no redirect URL was returned.");
        showToast({ title: "Checkout unavailable", description: "No redirect URL was returned.", variant: "error" });
        return;
      }
      showToast({ title: "Opening Stripe checkout", variant: "info" });
      window.location.href = checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed.";
      setError(message);
      showToast({ title: "Payment failed", description: message, variant: "error" });
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-66px)] max-w-2xl content-center px-4 py-10">
      <Card className="space-y-5 p-6">
        <div className="flex items-center gap-2"><CreditCard className="text-teal-700" /><h1 className="text-2xl font-black">Payment</h1></div>
        <div className="rounded-md bg-zinc-50 p-4">
          <p className="text-sm text-zinc-500">Order</p>
          <p className="font-bold">#{id.slice(0, 8)}</p>
          <div className="mt-3 flex items-center justify-between"><StatusBadge value={order?.status} /><strong>{formatMoney(order?.totalAmount)}</strong></div>
        </div>
        {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
        <Button className="w-full" disabled={createSession.isPending || order?.status !== "CONFIRMED"} onClick={handleCheckout}>
          {createSession.isPending ? "Opening Stripe..." : "Continue to Stripe Checkout"}
        </Button>
      </Card>
    </main>
  );
}
