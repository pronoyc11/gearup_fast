"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { AuthHydrator } from "./auth-hydrator";
import { ThemeHydrator } from "./theme-hydrator";
import { ToastViewport } from "./toast-viewport";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <AuthHydrator />
      <ThemeHydrator />
      {children}
      <ToastViewport />
    </QueryClientProvider>
  );
}
