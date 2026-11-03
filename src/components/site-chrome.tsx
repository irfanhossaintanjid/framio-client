"use client"

import { usePathname } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function SiteChrome() {
  const pathname = usePathname()
  if (pathname === "/register") return null

  return (
    <>
      <Navbar />
      <Footer />
    </>
  )
}
