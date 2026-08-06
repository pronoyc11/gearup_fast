"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateReviewForm } from "@/features/review/components/create-review-form";
import { useGearReviews } from "@/features/review/hooks/use-reviews";
import type { RentalItem, RentalOrder } from "@/features/rental/types/rental.types";
import { formatMoney } from "@/shared/utils/format";

type Props = {
  orders?: RentalOrder[];
  onCancel: (orderId: string) => void;
  onCancelItem: (itemId: string) => void;
  isCancelling?: boolean;
};

export function CustomerOrders({ orders, onCancel, onCancelItem, isCancelling }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-zinc-200 p-4">
        <h2 className="font-black">Rental Orders</h2>
      </div>
      <div className="divide-y divide-zinc-200">
        {orders?.map((order) => (
          <article key={order.id} className="space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link className="font-bold hover:text-teal-700" href={`/dashboard/customer/orders/${order.id}`}>
                  Order #{order.id.slice(0, 8)}
                </Link>
                <p className="text-sm text-zinc-500">
                  {order.startDate.slice(0, 10)} to {order.endDate.slice(0, 10)} | {formatMoney(order.totalAmount)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={order.status} />
                {order.status === "CONFIRMED" ? (
                  <Button asChild>
                    <Link href={`/dashboard/customer/orders/${order.id}/pay`}>Pay Now</Link>
                  </Button>
                ) : null}
                {order.status === "PLACED" ? (
                  <Button variant="secondary" disabled={isCancelling} onClick={() => onCancel(order.id)}>
                    Cancel Order
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {order.items?.map((item) => (
                <CustomerOrderItem key={item.id} item={item} orderId={order.id} onCancelItem={onCancelItem} isCancelling={isCancelling} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function CustomerOrderItem({
  item,
  orderId,
  onCancelItem,
  isCancelling,
}: {
  item: RentalItem;
  orderId: string;
  onCancelItem: (itemId: string) => void;
  isCancelling?: boolean;
}) {
  const canReview = ["RETURNED", "LATE_RETURN"].includes(item.status);
  const hasReviewInOrder = Boolean(item.review ?? item.reviewId ?? item.reviews?.length);
  const { data: gearReviews, isLoading: isLoadingReviews } = useGearReviews(canReview && !hasReviewInOrder ? item.gearId : "");
  const hasReviewInGearReviews = gearReviews?.some((review) => review.rentalOrderItemId === item.id) ?? false;
  const showReviewForm = canReview && !hasReviewInOrder && !isLoadingReviews && !hasReviewInGearReviews;

  return (
    <div className="rounded-md border border-zinc-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{item.gear?.title ?? item.gearId}</span>
        <StatusBadge value={item.status} />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-zinc-500">{formatMoney(item.subtotal)}</span>
        {item.status === "CONFIRMED" ? (
          <Button asChild size="sm">
            <Link href={`/dashboard/customer/orders/${orderId}/pay?itemId=${item.id}`}>Pay Item</Link>
          </Button>
        ) : null}
        {item.status === "PLACED" ? (
          <Button type="button" variant="secondary" size="sm" disabled={isCancelling} onClick={() => onCancelItem(item.id)}>
            Cancel Item
          </Button>
        ) : null}
      </div>
      {showReviewForm ? <CreateReviewForm rentalOrderItemId={item.id} /> : null}
    </div>
  );
}
