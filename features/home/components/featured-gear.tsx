"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GearGrid } from "@/features/gear/components/gear-grid";
import { useGears } from "@/features/gear/hooks/use-gears";

export function FeaturedGear() {
  const { data, isLoading,error } = useGears({ availability: "AVAILABLE", limit: 6, sortBy: "createdAt", sortOrder: "desc" });
  console.log(error);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Featured Gear</h2>
          <p className="text-zinc-600">Fresh equipment ready for your next match, hike, or training session.</p>
        </div>
        <Button asChild variant="secondary"><Link href="/gear">View all</Link></Button>
      </div>
      <GearGrid gears={data} isLoading={isLoading} />
    </section>
  );
}
