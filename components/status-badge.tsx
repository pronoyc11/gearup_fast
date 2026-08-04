import { statusClass } from "@/lib/ui";

export function StatusBadge({ value }: { value?: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(value)}`}>
      {(value ?? "UNKNOWN").replaceAll("_", " ")}
    </span>
  );
}
