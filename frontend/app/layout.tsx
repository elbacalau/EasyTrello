import type React from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";


import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/state-provider";

import "./globals.css";



const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "EasyTrello - Task Management",
  description: "A modern task and board management application",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
