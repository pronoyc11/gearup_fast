import { apiClient } from "@/shared/api/axios";
import type { ApiList } from "@/shared/types/api.types";
import type { Gear, GearFilters, GearPayload } from "../types/gear.types";

export const gearApi = {
  getGears: (filters: GearFilters = {}) =>
    apiClient.get<unknown, ApiList<Gear> | Gear[]>("/api/gear", {
      params: { limit: 12, ...filters },
    }),
  getGear: (gearId: string) => apiClient.get<unknown, Gear>(`/api/gear/${gearId}`),
  createGear: (payload: GearPayload) => apiClient.post<unknown, Gear>("/api/gear", payload),
};
