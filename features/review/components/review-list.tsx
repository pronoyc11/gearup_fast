"use client";

import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGearReviews } from "../hooks/use-reviews";

type Props = {
  gearId: string;
};

export function ReviewList({ gearId }: Props) {
  const { data: reviews } = useGearReviews(gearId);

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-black">Reviews</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {reviews?.length ? reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="mb-2 flex items-center gap-1 text-amber-500">
              {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
            </div>
            <p className="text-zinc-700">{review.comment}</p>
            <p className="mt-2 text-sm font-semibold text-zinc-500">{review.user?.name ?? "Customer"}</p>
          </Card>
        )) : <p className="text-zinc-600">No reviews yet.</p>}
      </div>
    </section>
  );
}
