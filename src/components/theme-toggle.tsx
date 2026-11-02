"use client"

import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const STORAGE_KEY = "framio-theme"

/**
 * The initial theme is applied by the inline script in the root layout, so this
 * component only needs to flip the class and remember the choice. Icons are
 * swapped with CSS to avoid a hydration mismatch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggleTheme() {
    const root = document.documentElement
    const isDark = root.classList.toggle("dark")

    root.style.colorScheme = isDark ? "dark" : "light"
    window.localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light")
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
    >
      <SunIcon className="hidden dark:block" aria-hidden="true" />
      <MoonIcon className="dark:hidden" aria-hidden="true" />
    </Button>
  )
}
