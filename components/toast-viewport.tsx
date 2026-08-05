"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/stores/toast.store";

const toastVariantClass = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50",
  error: "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950 dark:text-red-50",
  info: "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-50",
};

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div className="fixed right-4 top-20 z-50 grid w-[min(92vw,380px)] gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className={cn("rounded-lg border p-4 shadow-lg", toastVariantClass[toast.variant])}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-sm opacity-85">{toast.description}</p> : null}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dismissToast(toast.id)}>
              <X size={15} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
