"use client";

import { GearCard } from "@/components/gear-card";
import { api, listOf, type GearFilters } from "@/lib/api";
import { GearAvailability } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

export default function GearPage() {
  const [filters, setFilters] = useState<GearFilters>({ page: 1, limit: 12, sortBy: "pricePerDay", sortOrder: "asc" });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const { data, isLoading, error } = useQuery({ queryKey: ["gear", filters], queryFn: () => api.gear(filters) });
  const gear = listOf(data);

  function patch(value: Partial<GearFilters>) {
    setFilters((prev) => ({ ...prev, ...value, page: 1 }));
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr]">
      <aside className="panel h-fit p-4">
        <h1 className="mb-4 text-xl font-black">Browse Gear</h1>
        <div className="space-y-3">
          <label className="block text-sm font-bold">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-zinc-400" size={18} />
            <input className="input pl-10" placeholder="Football, tent, Wilson..." onChange={(e) => patch({ searchTerm: e.target.value })} />
          </div>
          <label className="block text-sm font-bold">Category</label>
          <select className="input" onChange={(e) => patch({ categoryName: e.target.value })}>
            <option value="">All categories</option>
            {categories?.map((category) => <option key={category.id}>{category.name}</option>)}
          </select>
          <label className="block text-sm font-bold">Brand</label>
          <input className="input" placeholder="Exact brand" onChange={(e) => patch({ brand: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-bold">Min</label>
              <input className="input" type="number" onChange={(e) => patch({ minPrice: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold">Max</label>
              <input className="input" type="number" onChange={(e) => patch({ maxPrice: e.target.value })} />
            </div>
          </div>
          <label className="block text-sm font-bold">Availability</label>
          <select className="input" onChange={(e) => patch({ availability: e.target.value as GearAvailability | "" })}>
            <option value="">Any</option>
            <option value="AVAILABLE">Available</option>
            <option value="OUT_OF_STOCK">Out of stock</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </aside>

      <section>
        {error ? <div className="panel p-6 text-red-700">{error.message}</div> : null}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-lg bg-zinc-200" />)}</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{gear.map((item) => <GearCard key={item.id} gear={item} />)}</div>
        )}
      </section>
    </main>
  );
}
