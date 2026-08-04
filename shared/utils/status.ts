export function getStatusClass(status?: string) {
  const map: Record<string, string> = {
    AVAILABLE: "bg-emerald-100 text-emerald-800",
    OUT_OF_STOCK: "bg-rose-100 text-rose-800",
    MAINTENANCE: "bg-amber-100 text-amber-800",
    PLACED: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-sky-100 text-sky-800",
    PARTIALLY_CONFIRMED: "bg-sky-100 text-sky-800",
    PAID: "bg-violet-100 text-violet-800",
    PICKED_UP: "bg-emerald-100 text-emerald-800",
    PARTIALLY_PICKED_UP: "bg-emerald-100 text-emerald-800",
    RETURNED: "bg-slate-200 text-slate-800",
    PARTIALLY_RETURNED: "bg-slate-200 text-slate-800",
    LATE_RETURN: "bg-orange-100 text-orange-800",
    CANCELLED: "bg-red-100 text-red-800",
    SUCCESS: "bg-emerald-100 text-emerald-800",
    PENDING: "bg-amber-100 text-amber-800",
    FAILED: "bg-red-100 text-red-800",
    ACTIVE: "bg-emerald-100 text-emerald-800",
    SUSPENDED: "bg-red-100 text-red-800",
  };

  return map[status ?? ""] ?? "bg-zinc-100 text-zinc-800";
}
