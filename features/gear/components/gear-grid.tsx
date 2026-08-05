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

  const gearList = toArray(gears);

  if (gearList.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-950">
        <h2 className="text-xl font-black">No gear exists</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Try changing the search term or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {gearList.map((gear) => <GearCard key={gear.id} gear={gear} />)}
    </div>
  );
}
