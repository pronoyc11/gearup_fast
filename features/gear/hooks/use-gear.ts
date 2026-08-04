"use client";

import { useQuery } from "@tanstack/react-query";
import { gearApi } from "../api/gear.api";

export function useGear(gearId: string) {
  return useQuery({
    queryKey: ["gear", gearId],
    queryFn: () => gearApi.getGear(gearId),
    enabled: Boolean(gearId),
  });
}
