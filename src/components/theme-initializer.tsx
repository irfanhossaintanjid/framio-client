"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("framio-theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const isDark = storedTheme === "dark" || (!storedTheme && prefersDark)
      document.documentElement.classList.toggle("dark", isDark)
      document.documentElement.style.colorScheme = isDark ? "dark" : "light"
    } catch {
      // Theme preferences are optional; keep the default theme if storage is unavailable.
    }
  }, [])

  return null
}
