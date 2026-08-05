import { apiClient } from "@/shared/api/axios";
import type { ApiList } from "@/shared/types/api.types";
import type { Gear, GearFilters, GearPayload, GearUpdatePayload } from "../types/gear.types";

export const gearApi = {
  getGears: (filters: GearFilters = {}) =>{
    
    return apiClient.get<unknown, ApiList<Gear> | Gear[]>("/api/gear", {
      params: { limit: 12, ...filters },
    })
  
  },
  getGear: (gearId: string) => apiClient.get<unknown, Gear>(`/api/gear/${gearId}`),
  createGear: (payload: GearPayload) => apiClient.post<unknown, Gear>("/api/gear", payload),
  updateGear: (gearId: string, payload: GearUpdatePayload) => apiClient.patch<unknown, Gear>(`/api/gear/${gearId}`, payload),
  deleteGear: (gearId: string) => apiClient.delete<unknown, Gear>(`/api/gear/${gearId}`),
};
