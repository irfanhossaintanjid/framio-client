import Image from "next/image"
import Link from "next/link"
import {
  FaFacebook,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#booking-works-heading" },
  { label: "About Us", href: "/#host-guarantee-heading" },
]

const categories = [
  { label: "Photo Studios", slug: "photo-studios" },
  { label: "Film Stages", slug: "sound-stages" },
  { label: "Podcast Rooms", slug: "podcast-rooms" },
  { label: "Music Suites", slug: "music-suites" },
  { label: "Art Workshops", slug: "art-workshops" },
]

const socialLinks = [
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "Instagram", href: "https://facebook.com", icon: FaFacebook },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
]

const legalLinks = [
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Trust & Safety", href: "/trust-and-safety" },
]

const footerLinkClass =
  "text-sm text-[#bdccd7] transition-colors hover:text-[#19a7ce] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a7ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071521]"

export function Footer() {
  return (
    <footer className="mt-15 bg-[#071521] text-white dark:bg-[#102a43]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.4fr] lg:gap-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a7ce]"
              aria-label="Framio home"
            >
              <Image
                src="/images/framio-logo-badge-180.png"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full"
              />
              <span className="font-heading text-xl font-bold text-white">
                Framio
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#bdccd7]">
              Empowering creators with accessible, flexible studio spaces
              worldwide.
            </p>
            <ul className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Framio on ${label}`}
                    className="flex size-9 items-center justify-center rounded-full bg-[#29495d] text-[#bdccd7] transition-colors hover:bg-[#19a7ce] hover:text-[#071521] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a7ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071521]"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick links">
            <h2 className="text-sm font-bold text-white">Quick Links</h2>
            <ul className="mt-4 space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link className={footerLinkClass} href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio categories">
            <h2 className="text-sm font-bold text-white">Studio Categories</h2>
            <ul className="mt-4 space-y-3">
              {categories.map(({ label, slug }) => (
                <li key={slug}>
                  <Link
                    className={footerLinkClass}
                    href={`/studios?category=${slug}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold text-white">Stay Updated</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#bdccd7]">
              Get curated studio drops and creative production discounts.
            </p>
            <form
              className="mt-5 flex flex-col gap-2 min-[480px]:flex-row"
              aria-label="Newsletter signup"
            >
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-lg border border-[#29495d] bg-[#0b1e2c] px-3.5 py-2.5 text-sm text-white placeholder:text-[#bdccd7]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a7ce]"
              />
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#146c94] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#19a7ce] hover:text-[#071521] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a7ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071521]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-[#29495d] pt-6 sm:mt-14">
          <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="leading-relaxed text-[#bdccd7]">
              © 2026 Framio Inc. All rights reserved. Peer-to-peer creative
              space network.
            </p>
            <nav aria-label="Legal">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {legalLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link className={footerLinkClass} href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
