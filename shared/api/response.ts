import type { ApiList } from "@/shared/types/api.types";

export function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

export function toArray<T>(value: ApiList<T> | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : value.data;
}
