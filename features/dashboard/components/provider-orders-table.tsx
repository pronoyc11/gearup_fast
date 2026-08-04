"use client";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RentalOrder, RentalStatus } from "@/features/rental/types/rental.types";
import { getNextProviderStatus } from "@/features/rental/utils/rental-status";

type Props = {
  orders: RentalOrder[];
  onUpdate: (itemId: string, status: RentalStatus) => void;
  isUpdating?: boolean;
};

export function ProviderOrdersTable({ orders, onUpdate, isUpdating }: Props) {
  return (
    <Card className="overflow-hidden">
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
            {orders.flatMap((order) => order.items.map((item) => {
              const nextStatus = getNextProviderStatus(item.status);

              return (
                <tr key={item.id} className="border-t border-zinc-100">
                  <td className="p-4 font-semibold">#{order.id.slice(0, 8)}</td>
                  <td className="p-4">{item.gear?.title ?? item.gearId}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">{order.startDate.slice(0, 10)} to {order.endDate.slice(0, 10)}</td>
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
            }))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
