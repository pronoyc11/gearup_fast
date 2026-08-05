"use client";

import { useCallback, useState } from "react";
import { GearFilterForm } from "../components/gear-filter-form";
import { GearGrid } from "../components/gear-grid";
import { GearPagination } from "../components/gear-pagination";
import { useGears } from "../hooks/use-gears";
import type { GearFilters } from "../types/gear.types";
import type { ApiList } from "@/shared/types/api.types";
import type { Gear } from "../types/gear.types";

export default function GearListPage() {
  const [filters, setFilters] = useState<GearFilters>({ page: 1, limit: 9, sortBy: "pricePerDay", sortOrder: "asc" });
  const { data, isLoading, error } = useGears(filters);
  const meta = Array.isArray(data) ? undefined : (data as ApiList<Gear> | undefined)?.meta;
  const page = filters.page ?? 1;

  const handleSearchChange = useCallback((searchTerm: string) => {
    setFilters((currentFilters) => ({ ...currentFilters, searchTerm, page: 1 }));
  }, []);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr]">
      <GearFilterForm
        onSearchChange={handleSearchChange}
        onFilterChange={(values) => setFilters((currentFilters) => ({ ...currentFilters, ...values, page: 1 }))}
      />
      <section>
        {error ? <div className="panel mb-4 p-6 text-red-700">{error.message}</div> : null}
        <GearGrid gears={data} isLoading={isLoading} />
        <GearPagination meta={meta} page={page} onPageChange={(nextPage) => setFilters((currentFilters) => ({ ...currentFilters, page: nextPage }))} />
      </section>
    </main>
  );
}
