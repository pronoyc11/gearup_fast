import type { ProviderRentalItem } from "../types/rental.types";

export function isProviderRentalItem(item: ProviderRentalItem, providerId?: string) {
  if (!providerId) return false;

  return (
    item.providerId === providerId ||
    item.provider?.id === providerId ||
    item.gear?.providerId === providerId ||
    item.gear?.provider?.id === providerId
  );
}

export function filterProviderRentalItems(items: ProviderRentalItem[], providerId?: string) {
  return items.filter((item) => isProviderRentalItem(item, providerId));
}
