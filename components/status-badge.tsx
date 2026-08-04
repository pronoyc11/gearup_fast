import { Badge } from "@/components/ui/badge";
import { statusClass } from "@/lib/ui";

export function StatusBadge({ value }: { value?: string }) {
  return (
    <Badge className={statusClass(value)}>
      {(value ?? "UNKNOWN").replaceAll("_", " ")}
    </Badge>
  );
}
