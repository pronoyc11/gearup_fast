"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { CreateRentalForm } from "@/features/rental/components/create-rental-form";
import { ReviewList } from "@/features/review/components/review-list";
import { fallbackGearImage } from "@/shared/utils/assets";
import { formatMoney } from "@/shared/utils/format";
import { useGear } from "../hooks/use-gear";
import { ProviderInfoCard } from "../components/provider-info-card";

function formatSpecificationLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSpecificationValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "Not specified";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getSpecificationEntries(specifications?: Record<string, unknown>) {
  if (!specifications) return [];
  return Object.entries(specifications).filter(([, value]) => value !== null && value !== undefined && value !== "");
}

export default function GearDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: gear, isLoading } = useGear(id);

  if (isLoading) return <main className="mx-auto max-w-7xl px-4 py-10"><div className="h-96 animate-pulse rounded-lg bg-zinc-200" /></main>;
  if (!gear) return <main className="mx-auto max-w-7xl px-4 py-10">Gear not found.</main>;
  const specificationEntries = getSpecificationEntries(gear.specifications);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-zinc-100">
          <Image src={gear.image || fallbackGearImage} alt={gear.title} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
        </div>
        <section className="space-y-5">
          <div>
            <StatusBadge value={gear.availability} />
            <h1 className="mt-3 text-3xl font-black">{gear.title}</h1>
            <p className="mt-2 text-zinc-600">{gear.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Card className="p-4"><p className="text-zinc-500">Brand</p><strong>{gear.brand}</strong></Card>
            <Card className="p-4"><p className="text-zinc-500">Price</p><strong>{formatMoney(gear.pricePerDay)}/day</strong></Card>
            <Card className="p-4"><p className="text-zinc-500">Stock</p><strong>{gear.stock}</strong></Card>
            <Card className="p-4"><p className="text-zinc-500">Category</p><strong>{gear.category?.name ?? "Gear"}</strong></Card>
          </div>
          <ProviderInfoCard gear={gear} />
          {specificationEntries.length ? (
            <Card className="p-4">
              <h2 className="text-lg font-black">Specifications</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {specificationEntries.map(([key, value]) => (
                  <div key={key} className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-900">
                    <dt className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
                      {formatSpecificationLabel(key)}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatSpecificationValue(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          ) : null}
          <AddToCartButton gear={gear} />
          <CreateRentalForm gearId={gear.id} maxQuantity={gear.stock} disabled={gear.availability !== "AVAILABLE"} />
        </section>
      </div>
      <ReviewList gearId={gear.id} />
    </main>
  );
}
