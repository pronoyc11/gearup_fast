"use client";

import { useState } from "react";
import { GearFilterForm } from "../components/gear-filter-form";
import { GearGrid } from "../components/gear-grid";
import { useGears } from "../hooks/use-gears";
import type { GearFilters } from "../types/gear.types";

export default function GearListPage() {
  const [filters, setFilters] = useState<GearFilters>({ page: 1, limit: 12, sortBy: "pricePerDay", sortOrder: "asc" });
  const { data, isLoading, error } = useGears(filters);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr]">
      <GearFilterForm onFilterChange={(values) => setFilters({ ...filters, ...values, page: 1 })} />
      <section>
        {error ? <div className="panel mb-4 p-6 text-red-700">{error.message}</div> : null}
        <GearGrid gears={data} isLoading={isLoading} />
      </section>
    </main>
  );
}
