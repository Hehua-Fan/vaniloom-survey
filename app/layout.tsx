import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaniloom内测用户调查问卷",
  description: "Vaniloom面向北美的同人/二创个性化创作平台内测用户调查问卷",
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