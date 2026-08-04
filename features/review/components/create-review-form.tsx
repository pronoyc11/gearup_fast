"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateReview } from "../hooks/use-reviews";
import { reviewSchema, type ReviewFormValues } from "../schemas/review.schemas";

type Props = {
  rentalOrderItemId: string;
};

export function CreateReviewForm({ rentalOrderItemId }: Props) {
  const createReview = useCreateReview();
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  });

  async function onSubmit(values: ReviewFormValues) {
    await createReview.mutateAsync({ rentalOrderItemId, ...values });
    form.reset();
  }

  return (
    <form className="mt-3 grid gap-2 sm:grid-cols-[90px_1fr_auto]" onSubmit={form.handleSubmit(onSubmit)}>
      <Input type="number" min={1} max={5} {...form.register("rating")} />
      <Input placeholder="Review comment" {...form.register("comment")} />
      <Button disabled={createReview.isPending}>Review</Button>
    </form>
  );
}
