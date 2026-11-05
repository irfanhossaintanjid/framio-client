import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeInitializer } from "@/components/theme-initializer";

import { Toaster } from "@/components/ui/toast";
import { Footer } from "@/components/footer";
import { Suspense } from "react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Framio — Book the studio that makes it real",
    template: "%s | Framio",
  },
  description:
    "Discover and book premium photography, music, film, and design studios in the cities that inspire you.",
  icons: {
    icon: "/images/framio-logo-badge-180.png",
    apple: "/images/framio-logo-badge-180.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeInitializer />
        <Suspense fallback={<div className="h-16" aria-hidden="true" />}>
          <Navbar />
        </Suspense>
          {children}
          <Footer />
        <Toaster />
      </body>
    </html>
  );
}
