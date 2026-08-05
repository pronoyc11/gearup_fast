"use client";

import { useCallback, useMemo, useState } from "react";
import { GearFilterForm } from "../components/gear-filter-form";
import { GearGrid } from "../components/gear-grid";
import { GearPagination } from "../components/gear-pagination";
import { useGears } from "../hooks/use-gears";
import type { GearFilters } from "../types/gear.types";
import { toArray } from "@/shared/api/response";

const pageSize = 6;
const apiFetchLimit = 100;

export default function GearListPage() {
  const [filters, setFilters] = useState<GearFilters>({ page: 1, limit: 6, sortBy: "pricePerDay", sortOrder: "asc" });
  const page = filters.page ?? 1;
  const queryFilters = useMemo(
    () => ({ ...filters, page: 1, limit: apiFetchLimit }),
    [filters],
  );
  const { data, isLoading, error } = useGears(queryFilters);
  const allGears = toArray(data);
  const visibleGears = allGears.slice((page - 1) * pageSize, page * pageSize);
  const meta = {
    page,
    limit: pageSize,
    total: allGears.length,
    totalPage: Math.ceil(allGears.length / pageSize),
  };

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
        <GearGrid gears={visibleGears} isLoading={isLoading} />
        <GearPagination
          meta={meta}
          page={page}
          currentCount={visibleGears.length}
          onPageChange={(nextPage) => setFilters((currentFilters) => ({ ...currentFilters, page: nextPage }))}
        />
      </section>
    </main>
  );
}
