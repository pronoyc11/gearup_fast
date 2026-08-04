"use client";

import { useQuery } from "@tanstack/react-query";
import { gearApi } from "../api/gear.api";
import type { GearFilters } from "../types/gear.types";

export function useGears(filters: GearFilters = {}) {
  return useQuery({
    queryKey: ["gears", filters],
    queryFn: () => gearApi.getGears(filters),
  });
}
