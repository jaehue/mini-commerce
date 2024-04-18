import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import Head from "@/components/head";

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
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ApolloWrapper>
            <Head />
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
              {children}
            </main>
          </ApolloWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
