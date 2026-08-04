"use client";

import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { money } from "@/lib/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, PackageCheck, Star } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function CustomerDashboard() {
  const qc = useQueryClient();
  const [message, setMessage] = useState("");
  const { data: orders, isLoading } = useQuery({ queryKey: ["customer-rentals"], queryFn: api.customerRentals });
  const { data: payments } = useQuery({ queryKey: ["payments"], queryFn: api.payments });
  const cancel = useMutation({
    mutationFn: api.cancelRental,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-rentals"] }),
    onError: (err) => setMessage(err.message),
  });
  const review = useMutation({
    mutationFn: api.createReview,
    onSuccess: () => {
      setMessage("Review submitted.");
      qc.invalidateQueries({ queryKey: ["customer-rentals"] });
    },
    onError: (err) => setMessage(err.message),
  });

  function submitReview(e: FormEvent<HTMLFormElement>, rentalOrderItemId: string) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    review.mutate({ rentalOrderItemId, rating: Number(form.get("rating")), comment: String(form.get("comment")) });
    e.currentTarget.reset();
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-black">Customer Dashboard</h1>
        <p className="text-zinc-600">Track rentals, pay confirmed orders, and review returned gear.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5"><PackageCheck className="mb-3 text-teal-700" /><p className="text-sm text-zinc-500">Orders</p><strong className="text-3xl">{orders?.length ?? 0}</strong></div>
        <div className="panel p-5"><CreditCard className="mb-3 text-teal-700" /><p className="text-sm text-zinc-500">Payments</p><strong className="text-3xl">{payments?.length ?? 0}</strong></div>
        <div className="panel p-5"><Star className="mb-3 text-teal-700" /><p className="text-sm text-zinc-500">Returned items</p><strong className="text-3xl">{orders?.flatMap((o) => o.items).filter((i) => ["RETURNED", "LATE_RETURN"].includes(i.status)).length ?? 0}</strong></div>
      </div>
      {message ? <div className="panel p-4 text-sm font-semibold text-teal-800">{message}</div> : null}
      <section className="panel overflow-hidden">
        <div className="border-b border-zinc-200 p-4"><h2 className="font-black">Rental Orders</h2></div>
        {isLoading ? <div className="p-4">Loading...</div> : (
          <div className="divide-y divide-zinc-200">
            {orders?.map((order) => (
              <article key={order.id} className="space-y-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-zinc-500">{order.startDate.slice(0, 10)} to {order.endDate.slice(0, 10)} · {money(order.totalAmount)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={order.status} />
                    {order.status === "CONFIRMED" ? <Link className="btn btn-primary" href={`/dashboard/customer/orders/${order.id}/pay`}>Pay Now</Link> : null}
                    {order.status === "PLACED" ? <button className="btn btn-ghost" onClick={() => cancel.mutate(order.id)}>Cancel</button> : null}
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="rounded-md border border-zinc-200 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{item.gear?.title ?? item.gearId}</span>
                        <StatusBadge value={item.status} />
                      </div>
                      {["RETURNED", "LATE_RETURN"].includes(item.status) && !item.review ? (
                        <form className="mt-3 grid gap-2 sm:grid-cols-[90px_1fr_auto]" onSubmit={(e) => submitReview(e, item.id)}>
                          <input className="input" name="rating" type="number" min={1} max={5} defaultValue={5} />
                          <input className="input" name="comment" placeholder="Review comment" />
                          <button className="btn btn-primary">Review</button>
                        </form>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="panel overflow-hidden">
        <div className="border-b border-zinc-200 p-4"><h2 className="font-black">Payments</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody>{payments?.map((payment) => (
              <tr key={payment.id} className="border-b border-zinc-100">
                <td className="p-4 font-semibold">{payment.id.slice(0, 8)}</td>
                <td className="p-4">{money(payment.amount)}</td>
                <td className="p-4"><StatusBadge value={payment.status} /></td>
                <td className="p-4">{payment.provider}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
