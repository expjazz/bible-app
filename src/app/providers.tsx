// app/providers.jsx
"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { TRPCProvider } from "~/server/trpc/client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <TRPCProvider>
      <SessionProvider>{children}</SessionProvider>
    </TRPCProvider>
  );
}
