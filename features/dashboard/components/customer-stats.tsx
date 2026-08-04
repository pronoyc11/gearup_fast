import { CreditCard, PackageCheck, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Payment } from "@/features/payment/types/payment.types";
import type { RentalOrder } from "@/features/rental/types/rental.types";

type Props = {
  orders?: RentalOrder[];
  payments?: Payment[];
};

export function CustomerStats({ orders, payments }: Props) {
  const returnedItems = orders?.flatMap((order) => order.items).filter((item) => ["RETURNED", "LATE_RETURN"].includes(item.status)).length ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-5"><PackageCheck className="mb-3 text-teal-700" /><p className="text-sm text-zinc-500">Orders</p><strong className="text-3xl">{orders?.length ?? 0}</strong></Card>
      <Card className="p-5"><CreditCard className="mb-3 text-teal-700" /><p className="text-sm text-zinc-500">Payments</p><strong className="text-3xl">{payments?.length ?? 0}</strong></Card>
      <Card className="p-5"><Star className="mb-3 text-teal-700" /><p className="text-sm text-zinc-500">Returned items</p><strong className="text-3xl">{returnedItems}</strong></Card>
    </div>
  );
}
