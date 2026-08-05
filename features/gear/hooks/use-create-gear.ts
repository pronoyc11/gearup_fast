"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gearApi } from "../api/gear.api";
import type { GearUpdatePayload } from "../types/gear.types";

export function useCreateGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gearApi.createGear,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gears"] }),
  });
}

export function useUpdateGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gearId, payload }: { gearId: string; payload: GearUpdatePayload }) => gearApi.updateGear(gearId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gears"] }),
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gearApi.deleteGear,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gears"] }),
  });
}
