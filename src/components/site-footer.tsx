import Image from "next/image"

import { NewsletterForm } from "@/components/newsletter-form"

const footerLinks = [
  {
    title: "Discover",
    links: [
      { label: "Photography studios", href: "#studios" },
      { label: "Music studios", href: "#studios" },
      { label: "Film stages", href: "#studios" },
      { label: "Design workshops", href: "#studios" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Framio", href: "#top" },
      { label: "How it works", href: "#how-it-works" },
      { label: "List your studio", href: "#for-studios" },
      { label: "Trust & safety", href: "#top" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Booking guide", href: "#how-it-works" },
      { label: "Pricing", href: "#top" },
      { label: "FAQs", href: "#top" },
      { label: "Support", href: "#top" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/framio-logo-transparent.png"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-lg object-contain"
              />
              <span className="font-heading text-2xl font-semibold tracking-tight">
                Framio
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A premium marketplace for booking photography, music, film, and
              design studios. Find the right space, lock in your time, and focus
              on the work.
            </p>
            <NewsletterForm />
          </div>

          {footerLinks.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <p className="font-heading text-sm font-medium">{section.title}</p>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Framio. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#top" className="transition-colors hover:text-foreground">
              Privacy policy
            </a>
            <a href="#top" className="transition-colors hover:text-foreground">
              Terms of service
            </a>
            <a href="#top" className="transition-colors hover:text-foreground">
              Cookie settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
