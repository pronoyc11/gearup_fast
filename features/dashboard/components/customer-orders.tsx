"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateReviewForm } from "@/features/review/components/create-review-form";
import type { RentalOrder } from "@/features/rental/types/rental.types";
import { money } from "@/lib/ui";

type Props = {
  orders?: RentalOrder[];
  onCancel: (orderId: string) => void;
  isCancelling?: boolean;
};

export function CustomerOrders({ orders, onCancel, isCancelling }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-zinc-200 p-4"><h2 className="font-black">Rental Orders</h2></div>
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
                {order.status === "CONFIRMED" ? <Button asChild><Link href={`/dashboard/customer/orders/${order.id}/pay`}>Pay Now</Link></Button> : null}
                {order.status === "PLACED" ? <Button variant="secondary" disabled={isCancelling} onClick={() => onCancel(order.id)}>Cancel</Button> : null}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {order.items?.map((item) => (
                <div key={item.id} className="rounded-md border border-zinc-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{item.gear?.title ?? item.gearId}</span>
                    <StatusBadge value={item.status} />
                  </div>
                  {["RETURNED", "LATE_RETURN"].includes(item.status) && !item.review ? <CreateReviewForm rentalOrderItemId={item.id} /> : null}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
