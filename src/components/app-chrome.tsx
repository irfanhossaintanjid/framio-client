"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <>
      {!isLoginPage ? <Navbar /> : null}
      <main className="flex-1">{children}</main>
      {!isLoginPage ? <Footer /> : null}
    </>
  )
}
