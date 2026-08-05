"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme.store";

export function ThemeHydrator() {
  const hydrate = useThemeStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
