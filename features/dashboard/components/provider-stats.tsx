import { Card } from "@/components/ui/card";
import type { Gear } from "@/features/gear/types/gear.types";
import type { RentalItem } from "@/features/rental/types/rental.types";

type Props = {
  gears: Gear[];
  rentalItems: RentalItem[];
};

export function ProviderStats({ gears, rentalItems }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-5"><p className="text-sm text-zinc-500">Listed gear</p><strong className="text-3xl">{gears.length}</strong></Card>
      <Card className="p-5"><p className="text-sm text-zinc-500">Incoming items</p><strong className="text-3xl">{rentalItems.length}</strong></Card>
      <Card className="p-5"><p className="text-sm text-zinc-500">Pending confirmation</p><strong className="text-3xl">{rentalItems.filter((item) => item.status === "PLACED").length}</strong></Card>
    </div>
  );
}
