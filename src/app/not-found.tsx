import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Building2Icon,
  CameraIcon,
  ClapperboardIcon,
  SearchIcon,
} from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-[65dvh] items-center justify-center overflow-hidden bg-background px-4 py-16 text-foreground sm:px-6">
      <section className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_0.9fr] md:gap-14">
        <div className="text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
            <SearchIcon className="size-3.5" aria-hidden="true" />
            FRAME NOT FOUND
          </p>
          <p className="mt-6 font-heading text-7xl leading-none font-extrabold tracking-tight text-primary sm:text-8xl">
            404
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            This space is off the set.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:mx-0 sm:text-base">
            We couldn’t find the page you were looking for. It may have moved,
            or the link may be out of frame.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Return to Home
            </Link>
            <Link
              href="/studios"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore Studios
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center"
        >
          <div className="absolute inset-[8%] rounded-full border border-dashed border-primary/30" />
          <div className="absolute inset-[19%] rounded-full bg-secondary/80" />
          <div className="absolute inset-[29%] rounded-full border border-border bg-card shadow-xl" />
          <div className="relative flex size-32 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:size-40">
            <Building2Icon className="size-16 sm:size-20" strokeWidth={1.35} />
            <span className="absolute -right-4 -bottom-3 flex size-14 items-center justify-center rounded-2xl border-4 border-background bg-highlight text-primary-foreground sm:size-16">
              <CameraIcon className="size-7 sm:size-8" strokeWidth={1.7} />
            </span>
          </div>
          <span className="absolute top-[13%] right-[18%] flex size-12 rotate-6 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-md sm:size-14">
            <ClapperboardIcon className="size-6 sm:size-7" />
          </span>
          <span className="absolute bottom-[15%] left-[13%] size-3 rounded-full bg-highlight shadow-[0_0_0_8px_var(--color-secondary)]" />
          <span className="absolute top-[27%] left-[12%] size-2 rounded-full bg-primary/50" />
        </div>
      </section>
    </main>
  )
}
