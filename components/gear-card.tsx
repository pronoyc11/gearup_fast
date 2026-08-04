import { Card } from "@/components/ui/card";
import type { Gear } from "@/lib/types";
import { fallbackImage, money } from "@/lib/ui";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "./status-badge";

export function GearCard({ gear }: { gear: Gear }) {
  return (
    <Card asChild className="group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
    <Link href={`/gear/${gear.id}`}>
      <div className="relative aspect-[4/3] bg-zinc-100">
        <Image
          src={gear.image || fallbackImage}
          alt={gear.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 font-bold text-zinc-950">{gear.title}</h3>
            <p className="text-sm text-zinc-500">{gear.brand}</p>
          </div>
          <StatusBadge value={gear.availability} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">{gear.category?.name ?? "Gear"}</span>
          <strong className="text-teal-700">{money(gear.pricePerDay)}/day</strong>
        </div>
      </div>
    </Link>
    </Card>
  );
}
