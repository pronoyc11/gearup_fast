"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiMeta } from "@/shared/types/api.types";

type Props = {
  meta?: ApiMeta;
  page: number;
  currentCount: number;
  onPageChange: (page: number) => void;
};

export function GearPagination({ meta, page, currentCount, onPageChange }: Props) {
  const totalPage = meta?.totalPage ?? (meta?.total && meta?.limit ? Math.ceil(meta.total / meta.limit) : undefined);
  const canGoNext = totalPage ? page < totalPage : currentCount > 0;
  const canGoPrevious = page > 1;

  if (currentCount === 0 && !canGoPrevious) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Page {page}{totalPage ? ` of ${totalPage}` : ""}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={!canGoPrevious} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={16} /> Previous
        </Button>
        <Button variant="secondary" disabled={!canGoNext} onClick={() => onPageChange(page + 1)}>
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
