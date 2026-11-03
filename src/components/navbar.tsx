"use client"
import { NavbarUser } from "@/lib/types/page"
import { ResponsiveNavbarProps } from "@/lib/types/page"
import Image from "next/image"
import { useState } from "react"
import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"





const navigationLinks = [
  { label: "Home", href: "#home-hero" },
  { label: "Explore Studios", href: "#studios" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about" },
]

const accountLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { label: "Add New Studio", href: "/add-studio", icon: PlusIcon },
  { label: "My Studio Listings", href: "/my-listings", icon: LayoutDashboardIcon },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarDaysIcon },
]

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function UserAvatar({ user, size = "default" }: { user: NavbarUser; size?: "default" | "lg" }) {
  return (
    <Avatar size={size}>
      {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  )
}

function ThemeToggle({ className }: { className?: string }) {
  function toggleTheme() {
    const root = document.documentElement
    const isDark = !root.classList.contains("dark")

    window.localStorage.setItem("framio-theme", isDark ? "dark" : "light")
    root.classList.toggle("dark", isDark)
    root.style.colorScheme = isDark ? "dark" : "light"
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <SunIcon className="hidden dark:block" aria-hidden="true" />
      <MoonIcon className="dark:hidden" aria-hidden="true" />
    </Button>
  )
}

function NavigationLinks({
  activeLink,
  onNavigate,
  mobile = false,
  onClose,
}: {
  activeLink: string
  onNavigate: (href: string) => void
  mobile?: boolean
  onClose?: () => void
}) {
  return (
    <>
      {navigationLinks.map((link) => {
        const active = activeLink === link.href
        const className = mobile
          ? "flex min-h-12 items-center rounded-lg px-3 text-base font-medium transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          : "flex h-16 items-center border-b-2 px-1 text-sm font-medium transition-colors"

        if (mobile) {
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                onNavigate(link.href)
                onClose?.()
              }}
              aria-current={active ? "page" : undefined}
              className={`${className} ${
                active ? "bg-secondary text-link" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </a>
          )
        }

        return (
          <a
            key={link.href}
            href={link.href}
            onClick={() => onNavigate(link.href)}
            aria-current={active ? "page" : undefined}
            className={`${className} ${
              active
                ? "border-link text-link"
                : "border-transparent text-muted-foreground hover:text-link"
            }`}
          >
            {link.label}
          </a>
        )
      })}
    </>
  )
}

function MobileAccountLinks({
  user,
  onLogout,
  onClose,
}: {
  user: NavbarUser | null | undefined
  onLogout?: () => void
  onClose: () => void
}) {
  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <a
          href="/login"
          onClick={onClose}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Sign In
        </a>
        <a
          href="/register"
          onClick={onClose}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Register
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-2 flex items-center gap-3 px-3 py-2">
        <UserAvatar user={user} size="lg" />
        <span className="font-medium text-foreground">{user.name}</span>
      </div>
      {accountLinks.map(({ label, href, icon: Icon }) => (
        <a
          key={href}
          href={href}
          onClick={onClose}
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </a>
      ))}
      <button
        type="button"
        onClick={() => {
          onLogout?.()
          onClose()
        }}
        className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        <LogOutIcon className="size-4" aria-hidden="true" />
        Logout
      </button>
    </div>
  )
}

function MobileMenu({
  user,
  onLogout,
  activeLink,
  onNavigate,
  tablet = false,
}: {
  user: NavbarUser | null | undefined
  onLogout?: () => void
  activeLink: string
  onNavigate: (href: string) => void
  tablet?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
       
    <Sheet open={open} onOpenChange={setOpen}>
       <ThemeToggle className="mr-2" />
      <SheetTrigger
      
        render={
          <button
            type="button"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label="Open navigation menu"
          />
        }
        
      >
        <MenuIcon aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side={tablet ? "top" : "right"}
        className={
          tablet
            ? "max-h-[calc(100dvh-4rem)] gap-0 overflow-y-auto border-border md:data-[side=top]:top-16 md:max-w-none"
            : "w-[min(22rem,90vw)] gap-0 overflow-y-auto border-border"
        }
      >
        <SheetHeader>
          
          <SheetTitle>{tablet ? "Framio navigation" : "Explore Framio"}</SheetTitle>
          <SheetDescription>
            Find the right creative space.
          </SheetDescription>
        </SheetHeader>
        <nav
          aria-label={tablet ? "Tablet navigation" : "Mobile navigation"}
          className="flex flex-col gap-1 px-4 pb-4"
        >
          <NavigationLinks
            activeLink={activeLink}
            onNavigate={onNavigate}
            mobile
            onClose={() => setOpen(false)}  
          />
        </nav>
        {!tablet ? (
          <>
            <div className="mx-4 border border-t " />
            
          </>
        ) : null}
        <div className="px-4 pb-5 mt-4">

          <MobileAccountLinks
            user={user}
            onLogout={onLogout}
            onClose={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Navbar({
  user,
  onLogout,
}: ResponsiveNavbarProps) {
  const [activeLink, setActiveLink] = useState("#home")

  return (
    <header
      id="home"
      className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          onClick={() => setActiveLink("#home")}
          className="flex shrink-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Framio home"
        >
          <Image
            src="/images/framio-logo-badge-180.png"
            alt=""
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
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden h-full items-center gap-6 lg:flex xl:gap-8"
        >
          <NavigationLinks
            activeLink={activeLink}
            onNavigate={setActiveLink}
          />
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {user ? (
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {user.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accountLinks.map(({ label, href, icon: Icon }) => (
                  <DropdownMenuItem
                    key={href}
                    nativeButton={false}
                    render={<a href={href} />}
                  >
                    <Icon aria-hidden="true" />
                    {label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onLogout}
                >
                  <LogOutIcon aria-hidden="true" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <a
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign In
              </a>
              <a href="/register" className={buttonVariants({ size: "sm" })}>
                Register
              </a>
            </>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex lg:hidden">
          <ThemeToggle />
          <MobileMenu
            user={user}
            onLogout={onLogout}
            activeLink={activeLink}
            onNavigate={setActiveLink}
            tablet
          />
        </div>

        <div className="flex md:hidden">
          <MobileMenu
            user={user}
            onLogout={onLogout}
            activeLink={activeLink}
            onNavigate={setActiveLink}
          />
        </div>
      </div>
    </header>
  )
}
