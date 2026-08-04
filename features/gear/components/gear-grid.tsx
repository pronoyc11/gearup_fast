"use client";

import { GearCard } from "@/components/gear-card";
import { toArray } from "@/shared/api/response";
import type { Gear } from "../types/gear.types";

type Props = {
  gears?: Gear[] | { data: Gear[] };
  isLoading?: boolean;
};

export function GearGrid({ gears, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-lg bg-zinc-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {toArray(gears).map((gear) => <GearCard key={gear.id} gear={gear} />)}
    </div>
  );
}
