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
          <h3 className="mb-2 text-sm font-bold uppercase text-zinc-500">Gear Listings</h3>
          <div className="space-y-2">{gears.slice(0, 8).map((item) => <div key={item.id} className="flex justify-between rounded-md bg-zinc-50 p-3"><span>{item.title}</span><StatusBadge value={item.availability} /></div>)}</div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase text-zinc-500">Rental Orders</h3>
          <div className="space-y-2">{rentals.slice(0, 8).map((order) => <div key={order.id} className="flex justify-between rounded-md bg-zinc-50 p-3"><span>#{order.id.slice(0, 8)}</span><StatusBadge value={order.status} /></div>)}</div>
        </div>
      </div>
    </Card>
  );
}
