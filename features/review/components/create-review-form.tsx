"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToastStore } from "@/stores/toast.store";
import { useCreateReview } from "../hooks/use-reviews";
import { reviewSchema, type ReviewFormValues } from "../schemas/review.schemas";

type Props = {
  rentalOrderItemId: string;
};

export function CreateReviewForm({ rentalOrderItemId }: Props) {
  const createReview = useCreateReview();
  const showToast = useToastStore((state) => state.showToast);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  });

  async function onSubmit(values: ReviewFormValues) {
    try {
      await createReview.mutateAsync({ rentalOrderItemId, ...values });
      setSubmitted(true);
      showToast({ title: "Review submitted", variant: "success" });
      form.reset();
    } catch (error) {
      showToast({ title: "Could not submit review", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    }
  }

  if (submitted) {
    return <p className="mt-3 text-sm font-semibold text-emerald-700">Review submitted.</p>;
  }

  return (
    <form className="mt-3 grid gap-2 sm:grid-cols-[90px_1fr_auto]" onSubmit={form.handleSubmit(onSubmit)}>
      <Input type="number" min={1} max={5} {...form.register("rating", { valueAsNumber: true })} />
      <Input placeholder="Review comment" {...form.register("comment")} />
      <Button disabled={createReview.isPending}>Review</Button>
    </form>
  );
}
