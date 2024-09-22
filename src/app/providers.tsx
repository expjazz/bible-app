// app/providers.jsx
"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { TRPCProvider } from "~/server/trpc/client";
import { ArticleStoreProvider } from "~/stores/article-store-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <SessionProvider>
        <ArticleStoreProvider>{children}</ArticleStoreProvider>
      </SessionProvider>
    </TRPCProvider>
  );
}
