import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaniloom Beta User Survey",
  description: "Welcome to the first round of internal beta testing for Vaniloom! Vaniloom is a personalized creative platform for fanfiction and derivative works.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Toaster position="top-center" reverseOrder={false} />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}