"use client";

import { Home, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

function Head() {
  const { isSignedIn } = useAuth();
  return (
    <header className="flex justify-between px-10 py-4">
      <Link href="/" className="flex gap-2 items-center">
        <Home />
        <span className="text-xl">mini commerce</span>
      </Link>
      {isSignedIn ? (
        <div className="flex gap-4 items-center">
          <Link href="/cart">
            <ShoppingCart />
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <SignUpButton />
      )}
    </header>
  );
}

export default Head;
