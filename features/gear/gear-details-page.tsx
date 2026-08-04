"use client";

import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { fallbackImage, money } from "@/lib/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarCheck, Star } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function GearDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { data: gear, isLoading } = useQuery({ queryKey: ["gear", id], queryFn: () => api.gearById(id) });
  const { data: reviews } = useQuery({ queryKey: ["reviews", id], queryFn: () => api.reviews(id) });
  const createRental = useMutation({
    mutationFn: api.createRental,
    onSuccess: (order) => router.push(`/dashboard/customer/orders/${order.id}/pay`),
    onError: (err) => setMessage(err.message),
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    createRental.mutate({
      startDate: String(form.get("startDate")),
      endDate: String(form.get("endDate")),
      items: [{ gearId: id, quantity: Number(form.get("quantity") || 1) }],
    });
  }

  if (isLoading) return <main className="mx-auto max-w-7xl px-4 py-10"><div className="h-96 animate-pulse rounded-lg bg-zinc-200" /></main>;
  if (!gear) return <main className="mx-auto max-w-7xl px-4 py-10">Gear not found.</main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-zinc-100">
          <Image src={gear.image || fallbackImage} alt={gear.title} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
        </div>
        <section className="space-y-5">
          <div>
            <StatusBadge value={gear.availability} />
            <h1 className="mt-3 text-3xl font-black">{gear.title}</h1>
            <p className="mt-2 text-zinc-600">{gear.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="panel p-4"><p className="text-zinc-500">Brand</p><strong>{gear.brand}</strong></div>
            <div className="panel p-4"><p className="text-zinc-500">Price</p><strong>{money(gear.pricePerDay)}/day</strong></div>
            <div className="panel p-4"><p className="text-zinc-500">Stock</p><strong>{gear.stock}</strong></div>
            <div className="panel p-4"><p className="text-zinc-500">Category</p><strong>{gear.category?.name ?? "Gear"}</strong></div>
          </div>
          <form onSubmit={submit} className="panel space-y-4 p-5">
            <div className="flex items-center gap-2 font-black"><CalendarCheck size={20} /> Rent Now</div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input required className="input" name="startDate" type="date" min={new Date().toISOString().slice(0, 10)} />
              <input required className="input" name="endDate" type="date" min={new Date().toISOString().slice(0, 10)} />
              <input required className="input" name="quantity" type="number" min={1} max={gear.stock} defaultValue={1} />
            </div>
            {message ? <p className="text-sm font-semibold text-red-700">{message}</p> : null}
            <button className="btn btn-primary w-full" disabled={createRental.isPending || gear.availability !== "AVAILABLE"}>
              {createRental.isPending ? "Creating order..." : "Create Rental Order"}
            </button>
          </form>
        </section>
      </div>
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-black">Reviews</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {reviews?.length ? reviews.map((review) => (
            <article key={review.id} className="panel p-4">
              <div className="mb-2 flex items-center gap-1 text-amber-500">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <p className="text-zinc-700">{review.comment}</p>
              <p className="mt-2 text-sm font-semibold text-zinc-500">{review.user?.name ?? "Customer"}</p>
            </article>
          )) : <p className="text-zinc-600">No reviews yet.</p>}
        </div>
      </section>
    </main>
  );
}
