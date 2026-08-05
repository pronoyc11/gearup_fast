import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import type { Gear } from "@/features/gear/types/gear.types";
import { fallbackGearImage } from "@/shared/utils/assets";
import { formatMoney } from "@/shared/utils/format";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "./status-badge";

export function GearCard({ gear }: { gear: Gear }) {
  return (
    <Card className="group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/gear/${gear.id}`} className="block">
        <div className="relative aspect-[4/3] bg-zinc-100">
          <Image
            src={gear.image || fallbackGearImage}
            alt={gear.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/gear/${gear.id}`} className="line-clamp-2 font-bold text-zinc-950 hover:text-teal-700 dark:text-zinc-50 dark:hover:text-teal-300">
              {gear.title}
            </Link>
            <p className="text-sm text-zinc-500">{gear.brand}</p>
          </div>
          <StatusBadge value={gear.availability} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">{gear.category?.name ?? "Gear"}</span>
          <strong className="text-teal-700">{formatMoney(gear.pricePerDay)}/day</strong>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild variant="outline">
            <Link href={`/gear/${gear.id}`}>Details</Link>
          </Button>
          <AddToCartButton gear={gear} />
        </div>
      </div>
    </Card>
  );
}
