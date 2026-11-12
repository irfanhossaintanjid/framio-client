import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeInitializer } from "@/components/theme-initializer";

import { ToastifyContainer } from "@/components/toastify-container";
import { Footer } from "@/components/footer";
import { Suspense } from "react";

function NavbarLoading() {
  return (
    <div
      className="flex h-16 items-center border-b border-border bg-background px-4 sm:px-6"
      role="status"
      aria-label="Loading navigation"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <span className="font-heading text-lg font-bold text-primary">Framio</span>
        <span className="h-8 w-28 animate-pulse rounded-lg bg-secondary" aria-hidden="true" />
      </div>
    </div>
  )
}


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
        <Suspense fallback={<NavbarLoading />}>
          <Navbar />
        </Suspense>
          {children}
          <Footer />
        <ToastifyContainer />
      </body>
    </html>
  );
}
