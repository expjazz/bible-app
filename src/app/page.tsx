"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import SignupForm from "~/components/SignupForm";
const LocalDockview = dynamic(
  () => import("~/components/LocalDockview/LocalDockview"),
  { ssr: false },
);
// import LocalDockview from "~/components/LocalDockview/LocalDockview";

export default function HomePage() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center bg-white text-black">
      <SignupForm />
      <div className="flex w-full flex-col items-center justify-center gap-12">
        <LocalDockview />
      </div>
    </main>
  );
}
