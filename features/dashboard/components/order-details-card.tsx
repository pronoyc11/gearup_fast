import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RentalOrder } from "@/features/rental/types/rental.types";
import { formatMoney } from "@/shared/utils/format";

type Props = {
  order: RentalOrder;
};

export function OrderDetailsCard({ order }: Props) {
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              Order #{order.id}
            </p>
            <h1 className="mt-2 text-3xl font-black">Rental Order Details</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {order.startDate.slice(0, 10)} to {order.endDate.slice(0, 10)}
            </p>
          </div>
          <StatusBadge value={order.status} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total</p>
            <strong>{formatMoney(order.totalAmount)}</strong>
          </div>
          <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Customer</p>
            <strong>{order.customer?.name ?? "Current customer"}</strong>
          </div>
          <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Created</p>
            <strong>{order.createdAt ? order.createdAt.slice(0, 10) : "Not available"}</strong>
          </div>
        </div>

        {order.status === "CONFIRMED" ? (
          <Button asChild className="mt-5">
            <Link href={`/dashboard/customer/orders/${order.id}/pay`}>Pay Confirmed Order</Link>
          </Button>
        ) : (
          <p className="mt-5 text-sm font-semibold text-amber-700 dark:text-amber-300">
            You can pay each confirmed item separately. Full-order payment becomes available after every provider confirms the order.
          </p>
        )}
      </Card>

      <section className="grid gap-4">
        {order.items.map((item) => {
          const providerName = item.provider?.name ?? item.gear?.provider?.name ?? item.providerId ?? item.gear?.providerId ?? "Not available";
          const providerEmail = item.provider?.email ?? item.gear?.provider?.email ?? item.providerEmail;

          return (
            <Card key={item.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link className="text-xl font-black hover:text-teal-700" href={`/gear/${item.gearId}`}>
                    {item.gear?.title ?? item.gearId}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Quantity {item.quantity} | Subtotal {formatMoney(item.subtotal)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Provider Email:{" "}
                    {providerEmail ? (
                      <a className="text-teal-700 hover:underline dark:text-teal-300" href={`mailto:${providerEmail}`}>
                        {providerEmail}
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </p>
                </div>
                <StatusBadge value={item.status} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Brand</p>
                  <strong>{item.gear?.brand ?? "Not available"}</strong>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Provider</p>
                  <strong>{providerName}</strong>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Provider Email</p>
                  <strong>
                    {providerEmail ? (
                      <a className="text-teal-700 hover:underline dark:text-teal-300" href={`mailto:${providerEmail}`}>
                        {providerEmail}
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </strong>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Category</p>
                  <strong>{item.gear?.category?.name ?? "Not available"}</strong>
                </div>
              </div>

              {item.status === "CONFIRMED" ? (
                <Button asChild className="mt-5">
                  <Link href={`/dashboard/customer/orders/${order.id}/pay?itemId=${item.id}`}>Pay This Item</Link>
                </Button>
              ) : null}
            </Card>
          );
        })}
      </section>
    </div>
  );
}
