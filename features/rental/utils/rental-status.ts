import type { RentalStatus } from "../types/rental.types";

export function getNextProviderStatus(status: RentalStatus): RentalStatus | null {
  if (status === "PLACED") return "CONFIRMED";
  if (status === "PAID") return "PICKED_UP";
  if (status === "PICKED_UP") return "RETURNED";
  return null;
}
