import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import SignupForm from "~/components/SignupForm";
import Navbar from "~/components/Navbar";
import { HydrateClient, trpc } from "~/server/trpc/server";
const LocalDockview = dynamic(
  () => import("~/components/LocalDockview/LocalDockview"),
  { ssr: false },
);
// import LocalDockview from "~/components/LocalDockview/LocalDockview";

export default async function HomePage({
  params,
}: {
  params: { articleId: string };
}) {
  void trpc.getArticleById.prefetch({ id: params.articleId });
  return (
    <HydrateClient>
      <main className="flex h-full w-full flex-col bg-white text-black">
        <div className="w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <LocalDockview />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
