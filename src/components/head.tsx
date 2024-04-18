"use client";

import { Home, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useCart } from "@/hooks/use-cart";

function Head() {
  const { isSignedIn } = useAuth();
  const { items } = useCart();
  const cartItemLength = items.length;
  return (
    <header className="flex justify-between px-10 py-4">
      <Link href="/" className="flex gap-2 items-center">
        <Home />
        <span className="text-xl">mini commerce</span>
      </Link>
      {isSignedIn ? (
        <div className="flex gap-4 items-center">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItemLength > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {cartItemLength}
              </span>
            )}
          </Link>

          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <SignInButton />
      )}
    </header>
  );
}

export default Head;
