"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import Navbar from "~/components/Navbar";
import SignupForm from "~/components/SignupForm";
const LocalDockview = dynamic(
  () => import("~/components/LocalDockview/LocalDockview"),
  { ssr: false },
);
// import LocalDockview from "~/components/LocalDockview/LocalDockview";

export default function HomePage() {
  return (
    <main className="flex h-full w-full flex-col bg-white text-black">
      <div className="flex w-full flex-col">
        <LocalDockview />
      </div>
    </main>
  );
}
