import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import type { Gear } from "@/features/gear/types/gear.types";
import type { RentalOrder } from "@/features/rental/types/rental.types";

type Props = {
  gears: Gear[];
  rentals: RentalOrder[];
};

export function ModerationPanel({ gears, rentals }: Props) {
  return (
    <Card className="p-5">
      <h2 className="mb-3 font-black">Content Moderation</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase text-zinc-500">All Gear Listings</h3>
          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {gears.map((item) => (
              <div key={item.id} className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold">{item.title}</span>
                  <StatusBadge value={item.availability} />
                </div>
                <p className="mt-1 text-sm text-zinc-500">{item.brand} | {item.category?.name ?? "Uncategorized"}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase text-zinc-500">All Rental Orders</h3>
          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {rentals.map((order) => (
              <div key={order.id} className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold">#{order.id.slice(0, 8)}</span>
                  <StatusBadge value={order.status} />
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {order.customer?.email ?? order.customer?.name ?? "Customer unavailable"} | {order.items?.length ?? 0} items
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
