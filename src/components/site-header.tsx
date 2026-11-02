import Image from "next/image"
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  MenuIcon,
  SparklesIcon,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { label: "Explore studios", href: "#studios" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For studios", href: "#for-studios" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Framio home"
        >
          <Image
            src="/images/framio-logo-transparent.png"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-lg object-contain"
            priority
          />
          <span className="font-heading text-xl font-semibold tracking-tight">
            Framio
          </span>
        </a>

        <nav
          aria-label="Main navigation"
          className="ml-6 hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </a>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                />
              }
            >
              Resources
              <ChevronDownIcon className="size-3.5" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Plan your next booking</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<a href="#how-it-works" />}>
                How booking works
              </DropdownMenuItem>
              <DropdownMenuItem render={<a href="#studios" />}>
                Browse by discipline
              </DropdownMenuItem>
              <DropdownMenuItem render={<a href="#for-studios" />}>
                Hosting checklist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            render={<a href="#for-studios" />}
          >
            Sign in
          </Button>
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            render={<a href="#for-studios" />}
          >
            <SparklesIcon aria-hidden="true" />
            List your studio
          </Button>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <MenuIcon aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(20rem,85vw)] gap-0 border-border"
            >
              <SheetHeader>
                <SheetTitle>Framio</SheetTitle>
                <SheetDescription>
                  Book the studio that makes it real.
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1 px-4 pb-4"
              >
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={<a href={link.href} />}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {link.label}
                  </SheetClose>
                ))}
                <SheetClose
                  render={<a href="#studios" />}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Browse by discipline
                </SheetClose>
              </nav>
              <SheetFooter className="border-t border-border">
                <Button className="w-full" render={<a href="#studios" />}>
                  Find a studio
                  <ArrowUpRightIcon aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  render={<a href="#for-studios" />}
                >
                  List your studio
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
