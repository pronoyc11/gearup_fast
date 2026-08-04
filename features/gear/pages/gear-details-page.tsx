"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { CreateRentalForm } from "@/features/rental/components/create-rental-form";
import { ReviewList } from "@/features/review/components/review-list";
import { fallbackImage, money } from "@/lib/ui";
import { useGear } from "../hooks/use-gear";

export default function GearDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: gear, isLoading } = useGear(id);

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
            <Card className="p-4"><p className="text-zinc-500">Brand</p><strong>{gear.brand}</strong></Card>
            <Card className="p-4"><p className="text-zinc-500">Price</p><strong>{money(gear.pricePerDay)}/day</strong></Card>
            <Card className="p-4"><p className="text-zinc-500">Stock</p><strong>{gear.stock}</strong></Card>
            <Card className="p-4"><p className="text-zinc-500">Category</p><strong>{gear.category?.name ?? "Gear"}</strong></Card>
          </div>
          <CreateRentalForm gearId={gear.id} maxQuantity={gear.stock} disabled={gear.availability !== "AVAILABLE"} />
        </section>
      </div>
      <ReviewList gearId={gear.id} />
    </main>
  );
}
