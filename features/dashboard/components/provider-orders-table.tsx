"use client";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProviderRentalItem, RentalStatus } from "@/features/rental/types/rental.types";
import { getNextProviderStatus } from "@/features/rental/utils/rental-status";
import { formatMoney } from "@/shared/utils/format";

type Props = {
  items: ProviderRentalItem[];
  onUpdate: (itemId: string, status: RentalStatus) => void;
  isUpdating?: boolean;
};

export function ProviderOrdersTable({ items, onUpdate, isUpdating }: Props) {
  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-black">No incoming orders</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Rental items for your gear will appear here.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Gear</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const nextStatus = getNextProviderStatus(item.status);
              const order = item.rentalOrder;

              return (
                <tr key={item.id} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="p-4 font-semibold">#{item.rentalOrderId.slice(0, 8)}</td>
                  <td className="p-4">
                    <p className="font-semibold">{order.customer?.name ?? "Customer"}</p>
                    <p className="text-xs text-zinc-500">{order.customer?.email ?? ""}</p>
                  </td>
                  <td className="p-4">{item.gear?.title ?? item.gearId}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">{order.startDate.slice(0, 10)} to {order.endDate.slice(0, 10)}</td>
                  <td className="p-4">{formatMoney(Number(item.subtotal ?? 0))}</td>
                  <td className="p-4"><StatusBadge value={item.status} /></td>
                  <td className="p-4">
                    {nextStatus ? (
                      <Button disabled={isUpdating} onClick={() => onUpdate(item.id, nextStatus)}>
                        Mark {nextStatus.replaceAll("_", " ")}
                      </Button>
                    ) : <span className="text-zinc-500">No action</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
