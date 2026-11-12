
"use client"

import type {
  NavbarUser,
  ResponsiveNavbarProps,
} from "@/lib/types/page"
import { authClient } from "@/lib/auth-client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  CalendarDaysIcon,
  HeartIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
  XIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Button,
  buttonVariants,
} from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "react-toastify"
import { ToastMessage } from "@/components/toast-message"

// ==========================================
// Navigation Configuration
// ==========================================

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
]

const accountLinks = [
  {
    label: "Saved Studios",
    href: "/saved-studios",
    icon: HeartIcon,
  },
  {
    label: "Add New Studio",
    href: "/add-studio",
    icon: PlusIcon,
  },
  {
    label: "My Studio Listings",
    href: "/my-listings",
    icon: LayoutDashboardIcon,
  },
  {
    label: "My Bookings",
    href: "/my-bookings",
    icon: CalendarDaysIcon,
  },
]

// ==========================================
// Helper Functions
// ==========================================

function getInitials(name: string) {
  const cleanName = name.trim()

  if (!cleanName) return "U"

  return cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}



function isActiveLink(
  href: string,
  pathname: string,
  activeHash: string
) {
  // Homepage section links
  if (href.startsWith("/#")) {
    return (
      pathname === "/" &&
      activeHash === href.substring(1)
    )
  }

  // Home
  if (href === "/") {
    return pathname === "/" && !activeHash
  }

  // Explore Studios and nested studio details
  if (href === "/studios") {
    return (
      pathname === "/studios" ||
      pathname.startsWith("/studios/")
    )
  }

  // Other routes
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  )
}

// ==========================================
// User Avatar
// ==========================================

function UserAvatar({
  user,
  size = "default",
}: {
  user: NavbarUser
  size?: "default" | "lg"
}) {
  return (
    <Avatar size={size}>
      {user.image ? (
        <AvatarImage
          src={user.image}
          alt={user.name}
        />
      ) : null}

      <AvatarFallback>
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

// ==========================================
// Theme Toggle
// ==========================================

function ThemeToggle({
  className,
}: {
  className?: string
}) {
  const [isDark, setIsDark] = useState(false)

  // Read the saved theme when the component mounts
  useEffect(() => {
    const root = document.documentElement
    const savedTheme = localStorage.getItem("framio-theme")

    const dark =
      savedTheme === "dark" ||
      (!savedTheme && root.classList.contains("dark"))

    root.classList.toggle("dark", dark)
    root.style.colorScheme = dark ? "dark" : "light"

   
  }, [])

  function toggleTheme() {
    const root = document.documentElement
    const nextTheme = !isDark

    root.classList.toggle("dark", nextTheme)
    root.style.colorScheme = nextTheme ? "dark" : "light"

    try {
      localStorage.setItem(
        "framio-theme",
        nextTheme ? "dark" : "light"
      )
    } catch {
      // Theme still works even if localStorage is unavailable.
    }

    setIsDark(nextTheme)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleTheme}
      aria-label={
        isDark ? "Switch to light theme" : "Switch to dark theme"
      }
      title={
        isDark ? "Switch to light theme" : "Switch to dark theme"
      }
    >
      {isDark ? (
        <SunIcon aria-hidden="true" className="hover:bg-[#ffffff] hover:text-[#0b1e2c]" />
      ) : (
        <MoonIcon aria-hidden="true" className="hover:bg-[#0b1e2c] hover:text-[#ffffff]" />
      )}
    </Button>
  )
}

// ==========================================
// Navigation Links
// ==========================================

function NavigationLinks({
  pathname,
  activeHash,
  onNavigate,
  mobile = false,
  onClose,
}: {
  pathname: string
  activeHash: string
  onNavigate: (href: string) => void
  mobile?: boolean
  onClose?: () => void
}) {
  return (
    <>
      {navigationLinks.map((link) => {
        const active = isActiveLink(
          link.href,
          pathname,
          activeHash
        )

        const className = mobile
          ? "flex min-h-12 items-center rounded-lg px-3 text-base font-medium transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          : "flex h-16 items-center border-b-2 px-1 text-sm font-medium transition-colors"

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => {
              onNavigate(link.href)
              onClose?.()
            }}
            aria-current={active ? "page" : undefined}
            className={`${className} ${
              active
                ? mobile
                  ? "bg-secondary text-link"
                  : "border-link text-link"
                : mobile
                  ? "text-muted-foreground"
                  : "border-transparent text-muted-foreground hover:text-link"
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}

// ==========================================
// Mobile Account Links
// ==========================================
function MobileAccountLogout({
  handleSignoout,
  onClose,
  isLoggingOut,
}: {
  handleSignoout: () => void
  onClose: () => void
  isLoggingOut: boolean
}) {
  return (
    <>
      {/* Logout */}
      <button
        type="button"
        disabled={isLoggingOut}
        onClick={() => {
          onClose()
          handleSignoout()
        }}
        className="flex min-h-11 items-center gap-3 rounded-lg px-7 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-wait disabled:opacity-60"
      >
        {isLoggingOut ? <Loader2Icon className="size-4 animate-spin" aria-hidden="true" /> : <LogOutIcon className="size-4" aria-hidden="true" />}

        {isLoggingOut ? "Logging out…" : "Logout"}
      </button>
    </>
  )
}




function MobileAccountLinks({
  user,
  onClose,
  pathname,
  activeHash,
}: {
  user: NavbarUser | null | undefined
  onClose: () => void
  pathname: string
  activeHash: string
}) 
 {
  // Unauthenticated State
  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/login"
          onClick={onClose}
          aria-current={pathname === "/login" ? "page" : undefined}
          className={`inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-secondary ${pathname === "/login" ? "border-primary text-link" : ""}`}
        >
          Login
        </Link>

        <Link
          href="/register"
          onClick={onClose}
          aria-current={pathname === "/register" ? "page" : undefined}
          className={`inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover ${pathname === "/register" ? "ring-2 ring-primary/40 ring-offset-2" : ""}`}
        >
          Register
        </Link>
      </div>
    )
  }

  // Authenticated State
  return (
    <div className="flex flex-col gap-4">
      {/* User Information */}
      <div className="mb-2 flex items-center gap-3 ">
        <UserAvatar user={user} size="lg" />

        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground">
             {user.email}
          </p>
        </div>
      </div>

      <div className=" border-t border-border" />



      {/* Account Navigation */}
      <span className=" font-bold text-gray-600">HOSTING</span>
      {accountLinks.map(({ label, href, icon: Icon }) => {
        const active = isActiveLink(href, pathname, activeHash)
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${active ? "bg-secondary text-link" : "text-muted-foreground"}`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
            {active ? (
              <span className="ml-auto size-1.5 rounded-full bg-primary" aria-hidden="true" />
            ) : null}
          </Link>
        )
      })}

      <div className="mt-3 border-t border-border" />

    </div>
  )
}

// ==========================================
// Mobile / Tablet Menu
// ==========================================

function MobileMenu({
  user,
  onLogout,
  isLoggingOut,
  pathname,
  activeHash,
  onNavigate,
  tablet = false,
}: {
  user: NavbarUser | null | undefined
  onLogout?: () => void
  isLoggingOut: boolean
  pathname: string
  activeHash: string
  onNavigate: (href: string) => void
  tablet?: boolean
}) {
  const [open, setOpen] = useState(false)

  function closeMenu() {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
            aria-label="Open navigation menu"
            aria-expanded={open}
          />
        }
      >
        <MenuIcon aria-hidden="true" />
      </SheetTrigger>

      <SheetContent
        side={tablet ? "top" : "left"}
        showCloseButton={false}
        className={
          tablet
            ? "max-h-[calc(100dvh-4rem)] gap-0 overflow-y-auto border-border md:data-[side=top]:top-16 md:max-w-none"
            : "w-[min(22rem,90vw)] gap-0 overflow-y-auto border-border"
        }
      >
        <SheetHeader className="gap-3">
          <div className="flex min-h-8 items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Menu</span>
            <SheetClose
              render={
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              }
            >
              <XIcon className="size-4" aria-hidden="true" />
            </SheetClose>
          </div>
          <MobileAccountLinks
            user={user}
            onClose={closeMenu}
            pathname={pathname}
            activeHash={activeHash}
          />
        </SheetHeader>
        {/* Main Navigation */}
        <nav
          aria-label={
            tablet ? "Tablet navigation" : "Mobile navigation"
          }
          className="flex flex-col px-4"
        >

                <span className=" mb-4 font-bold text-gray-600">MARKETPLACE</span>

          <NavigationLinks
            pathname={pathname}
            activeHash={activeHash}
            onNavigate={onNavigate}
            mobile
            onClose={closeMenu}
          />
        </nav>

        <div className="mx-4 border-t border-border" />

         <div >
          <MobileAccountLogout
            handleSignoout={onLogout ?? (() => {})}
            onClose={closeMenu}
            isLoggingOut={isLoggingOut}
            />
        </div>

      </SheetContent>
    </Sheet>
  )
}

// ==========================================
// Main Navbar
// ==========================================

export function Navbar({
  
  onLogout,
}: ResponsiveNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
   const {data:session} = authClient.useSession()

   const user = session?.user
     ? { ...session.user, image: session.user.image ?? undefined }
     : undefined

  async function handleLogout() {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    if (onLogout) {
      try {
        onLogout()
      } finally {
        setIsLoggingOut(false)
      }
      return
    }

    try {
      const { error } = await authClient.signOut()

      if (error) {
        toast.error(<ToastMessage title="Logout failed" description={error.message} />)
        setIsLoggingOut(false)
        return
      }

      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast.error(<ToastMessage title="Logout failed" description="Something went wrong. Please try again." />)
      setIsLoggingOut(false)
    }
  }

  const [activeHash, setActiveHash] = useState("")

  // Sync hash when the route or browser history changes
  useEffect(() => {
    function updateHash() {
      setActiveHash(window.location.hash)
    }

    updateHash()

    window.addEventListener("hashchange", updateHash)
    window.addEventListener("popstate", updateHash)

    return () => {
      window.removeEventListener("hashchange", updateHash)
      window.removeEventListener("popstate", updateHash)
    }
  }, [pathname])

  // Update active navigation after clicking a link
  function handleNavigate(href: string) {
    const hashIndex = href.indexOf("#")

    setActiveHash(
      hashIndex !== -1 ? href.substring(hashIndex) : ""
    )
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ==================================
            Brand Logo
        ================================== */}

        <Link
          href="/"
          onClick={() => setActiveHash("")}
          className="flex shrink-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Framio home"
        >
          <Image
            src="/images/framio-logo-badge-180.png"
            alt="Framio logo"
            width={40}
            height={40}
            className="size-10 rounded-full object-contain"
            priority
          />

          <span className="hidden flex-col leading-tight md:flex">
            <span className="font-heading text-lg font-semibold tracking-tight">
              Framio
            </span>

            <span className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
              Creative Studios
            </span>
          </span>
        </Link>

        {/* ==================================
            Desktop Navigation
        ================================== */}

        <nav
          aria-label="Main navigation"
          className="hidden h-full items-center gap-6 lg:flex xl:gap-8"
        >
          <NavigationLinks
            pathname={pathname}
            activeHash={activeHash}
            onNavigate={handleNavigate}
          />
        </nav>

        {/* ==================================
            Desktop Account Section
        ================================== */}

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />

          {user ? (
            /* Authenticated State */
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className={buttonVariants({
                      variant: "ghost",
                      className: "gap-2 px-2",
                    })}
                    aria-label={`Open ${user.name}'s account menu`}
                  />
                }
              >
                <UserAvatar user={user} />

                <span className="max-w-32 truncate text-sm font-medium">
                  {user.name}
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56"
              >
                <div className="gap-3 px-3 py-2"> 
                <div className="truncate font-bold ">
                  {user.name}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  {user.email}
                </div>
                </div>
                <DropdownMenuSeparator />

                {accountLinks.map(({ label, href, icon: Icon }) => {
                  const active = isActiveLink(href, pathname, activeHash)
                  return (
                    <DropdownMenuItem
                      key={href}
                      nativeButton={false}
                      aria-current={active ? "page" : undefined}
                      className={active ? "bg-secondary text-link" : ""}
                      render={<Link href={href} />}
                    >
                      <Icon aria-hidden="true" />
                      {label}
                      {active ? (
                        <span className="ml-auto size-1.5 rounded-full bg-primary" aria-hidden="true" />
                      ) : null}
                    </DropdownMenuItem>
                  )
                })}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  disabled={isLoggingOut}
                  onClick={() => void handleLogout()}
                >
                  {isLoggingOut ? <Loader2Icon className="animate-spin" aria-hidden="true" /> : <LogOutIcon aria-hidden="true" />}
                  {isLoggingOut ? "Logging out…" : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Unauthenticated State */
            <>
              <Link
                href="/login"
                aria-current={pathname === "/login" ? "page" : undefined}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: pathname === "/login" ? "text-link" : undefined,
                })}
              >
                Login
              </Link>

              <Link
                href="/register"
                aria-current={pathname === "/register" ? "page" : undefined}
                className={buttonVariants({
                  size: "sm",
                  className: pathname === "/register" ? "ring-2 ring-primary/40 ring-offset-2" : undefined,
                })}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* ==================================
            Tablet Navigation
            768px - 1023px
        ================================== */}

        <div className="hidden items-center gap-2 md:flex lg:hidden">
          <ThemeToggle />

          <MobileMenu
            user={user}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            pathname={pathname}
            activeHash={activeHash}
            onNavigate={handleNavigate}
            tablet
          />
        </div>

        {/* ==================================
            Mobile Navigation
            Below 768px
        ================================== */}

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />

          <MobileMenu
            user={user}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            pathname={pathname}
            activeHash={activeHash}
            onNavigate={handleNavigate}
          />
        </div>

      </div>
    </header>
  )
}
