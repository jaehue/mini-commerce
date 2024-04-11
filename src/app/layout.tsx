import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

import "./globals.css";
import Link from "next/link";
import { Home, ShoppingCart } from "lucide-react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Mini Commerce",
  description: "mini commerce app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <header className="flex justify-between px-10 py-4">
          <Link href="/" className="flex gap-2 items-center">
            <Home />
            <span className="text-xl">mini commerce</span>
          </Link>
          <Link href="/cart">
            <ShoppingCart />
          </Link>
        </header>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          {children}
        </main>
      </body>
    </html>
  );
}
