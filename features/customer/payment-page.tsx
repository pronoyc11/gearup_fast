"use client";

import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { money } from "@/lib/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PayPage() {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState("");
  const { data: order } = useQuery({ queryKey: ["customer-rental", id], queryFn: () => api.customerRental(id) });
  const pay = useMutation({
    mutationFn: () => api.createPaymentSession(id),
    onSuccess: (session) => {
      const url = session.url ?? session.sessionUrl;
      if (url) window.location.href = url;
      else setError("Checkout session created, but no redirect URL was returned.");
    },
    onError: (err) => setError(err.message),
  });

  return (
    <main className="mx-auto grid min-h-[calc(100vh-66px)] max-w-2xl content-center px-4 py-10">
      <section className="panel space-y-5 p-6">
        <div className="flex items-center gap-2"><CreditCard className="text-teal-700" /><h1 className="text-2xl font-black">Payment</h1></div>
        <div className="rounded-md bg-zinc-50 p-4">
          <p className="text-sm text-zinc-500">Order</p>
          <p className="font-bold">#{id.slice(0, 8)}</p>
          <div className="mt-3 flex items-center justify-between"><StatusBadge value={order?.status} /><strong>{money(order?.totalAmount)}</strong></div>
        </div>
        {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
        <button className="btn btn-primary w-full" disabled={pay.isPending || order?.status !== "CONFIRMED"} onClick={() => pay.mutate()}>
          {pay.isPending ? "Opening Stripe..." : "Continue to Stripe Checkout"}
        </button>
      </section>
    </main>
  );
}
