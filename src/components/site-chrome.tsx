"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isRegisterPage = pathname === "/register"

  return (
    <>
      {!isRegisterPage ? <Navbar /> : null}
      <main className="flex-1">{children}</main>
      {!isRegisterPage ? <Footer /> : null}
    </>
  )
}
