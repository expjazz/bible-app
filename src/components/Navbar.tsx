"use client";

import React from "react";
import SignupForm from "./SignupForm";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoginForm from "./LoginForm";

const Navbar = () => {
  const { data: session, status } = useSession();
  console.log(session, status, "auth");
  return (
    <div className="flex">
      {status !== "authenticated" ? (
        <div className="flex">
          <SignupForm />
          <LoginForm />
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
