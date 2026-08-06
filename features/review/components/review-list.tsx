"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Pencil, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/features/review/types/review.types";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { useDeleteReview, useGearReviews, useUpdateReview } from "../hooks/use-reviews";
import { reviewSchema, type ReviewFormValues } from "../schemas/review.schemas";
import { getReviewAuthorName } from "../utils/review-author";

type Props = {
  gearId: string;
};

export function ReviewList({ gearId }: Props) {
  const { data: reviews } = useGearReviews(gearId);
  const user = useAuthStore((state) => state.user);
  const [showOwnOnly, setShowOwnOnly] = useState(false);
  const isCustomer = user?.role === "CUSTOMER";
  const visibleReviews = showOwnOnly && user ? reviews?.filter((review) => isOwnReview(review, user.id)) : reviews;

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black">Reviews</h2>
        {isCustomer ? (
          <Button type="button" variant={showOwnOnly ? "default" : "secondary"} onClick={() => setShowOwnOnly((current) => !current)}>
            {showOwnOnly ? "Showing My Reviews" : "Show My Reviews"}
          </Button>
        ) : null}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {visibleReviews?.length ? visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} isOwn={Boolean(user && isOwnReview(review, user.id))} />
        )) : <p className="text-zinc-600">{showOwnOnly ? "You have not reviewed this gear yet." : "No reviews yet."}</p>}
      </div>
    </section>
  );
}

function isOwnReview(review: Review, userId: string) {
  return review.userId === userId || review.customerId === userId || review.user?.id === userId || review.customer?.id === userId;
}

function ReviewCard({ review, isOwn }: { review: Review; isOwn: boolean }) {
  const showToast = useToastStore((state) => state.showToast);
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: review.rating, comment: review.comment },
  });

  async function handleUpdate(values: ReviewFormValues) {
    try {
      await updateReview.mutateAsync({ reviewId: review.id, payload: values });
      setIsEditing(false);
      setIsMenuOpen(false);
      showToast({ title: "Review updated", variant: "success" });
    } catch (error) {
      showToast({ title: "Could not update review", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete your review?");
    if (!confirmed) return;

    try {
      await deleteReview.mutateAsync(review.id);
      showToast({ title: "Review deleted", variant: "success" });
    } catch (error) {
      showToast({ title: "Could not delete review", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    }
  }

  return (
    <Card className="relative p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm font-black text-zinc-800 dark:text-zinc-100">
          Review by {getReviewAuthorName(review)}
        </p>
        {isOwn ? (
          <div className="relative">
            <Button type="button" variant="ghost" size="icon" aria-label="Review actions" onClick={() => setIsMenuOpen((current) => !current)}>
              <MoreVertical size={18} />
            </Button>
            {isMenuOpen ? (
              <div className="absolute right-0 top-11 z-10 grid min-w-32 gap-1 rounded-md border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                <Button type="button" variant="ghost" className="justify-start" onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}>
                  <Pencil size={16} /> Edit
                </Button>
                <Button type="button" variant="ghost" className="justify-start text-red-700" disabled={deleteReview.isPending} onClick={handleDelete}>
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {isEditing ? (
        <form className="space-y-3" onSubmit={form.handleSubmit(handleUpdate)}>
          <Input type="number" min={1} max={5} {...form.register("rating", { valueAsNumber: true })} />
          <Textarea {...form.register("comment")} />
          <div className="text-sm font-semibold text-red-700">
            {form.formState.errors.rating?.message ?? form.formState.errors.comment?.message}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={updateReview.isPending}>{updateReview.isPending ? "Saving..." : "Save Review"}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              <X size={16} /> Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className="mb-2 flex items-center gap-1 text-amber-500">
            {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
          </div>
          <p className="text-zinc-700 dark:text-zinc-300">{review.comment}</p>
        </>
      )}
    </Card>
  );
}
