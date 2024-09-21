"use client";

import React from "react";
import SignupForm from "./SignupForm";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();
  console.log(session, status, "auth");
  return (
    <div className="flex">
      {status !== "authenticated" ? (
        <div className="flex">
          <SignupForm />
          <Link href="/api/auth/signin">Login</Link>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
