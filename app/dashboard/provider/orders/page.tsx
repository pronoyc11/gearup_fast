"use client";

import { StatusBadge } from "@/components/status-badge";
import { api, listOf } from "@/lib/api";
import { nextProviderStatus } from "@/lib/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { useState } from "react";

export default function ProviderOrdersPage() {
  const qc = useQueryClient();
  const [message, setMessage] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["provider-rentals"], queryFn: api.providerRentals });
  const update = useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: NonNullable<ReturnType<typeof nextProviderStatus>> }) =>
      api.updateRentalItem(itemId, status),
    onSuccess: () => {
      setMessage("Order item updated.");
      qc.invalidateQueries({ queryKey: ["provider-rentals"] });
    },
    onError: (err) => setMessage(err.message),
  });
  const orders = listOf(data);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <div className="flex items-center gap-2">
          <ClipboardList className="text-teal-700" />
          <h1 className="text-3xl font-black">Incoming Orders</h1>
        </div>
        <p className="text-zinc-600">Confirm placed items, mark paid items picked up, and close returned rentals.</p>
      </header>
      {message ? <div className="panel p-4 text-sm font-semibold text-teal-800">{message}</div> : null}
      <section className="panel overflow-hidden">
        {isLoading ? (
          <div className="p-5">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Gear</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.flatMap((order) =>
                  (order.items ?? []).map((item) => {
                    const next = nextProviderStatus(item.status);
                    return (
                      <tr key={item.id} className="border-t border-zinc-100">
                        <td className="p-4 font-semibold">#{order.id.slice(0, 8)}</td>
                        <td className="p-4">{item.gear?.title ?? item.gearId}</td>
                        <td className="p-4">{item.quantity}</td>
                        <td className="p-4">{order.startDate.slice(0, 10)} to {order.endDate.slice(0, 10)}</td>
                        <td className="p-4"><StatusBadge value={item.status} /></td>
                        <td className="p-4">
                          {next ? (
                            <button className="btn btn-primary" disabled={update.isPending} onClick={() => update.mutate({ itemId: item.id, status: next })}>
                              Mark {next.replaceAll("_", " ")}
                            </button>
                          ) : (
                            <span className="text-zinc-500">No action</span>
                          )}
                        </td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
