import { Badge } from "@/components/ui/badge";
import { getStatusClass } from "@/shared/utils/status";

export function StatusBadge({ value }: { value?: string }) {
  return (
    <Badge className={getStatusClass(value)}>
      {(value ?? "UNKNOWN").replaceAll("_", " ")}
    </Badge>
  );
}
