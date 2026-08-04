"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gearApi } from "../api/gear.api";

export function useCreateGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gearApi.createGear,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gears"] }),
  });
}
