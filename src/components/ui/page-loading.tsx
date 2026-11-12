import Image from "next/image"
import { LoadingSpinner } from "@/components/ui/spinner"

export function PageLoading({ label = "Loading Framio" }: { label?: string }) {
  return (
    <main
      className="min-h-[70dvh] bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/framio-logo-badge-180.png"
            alt=""
            width={36}
            height={36}
            unoptimized
          />
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-2 w-36 animate-pulse rounded bg-secondary" />
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3 text-sm font-semibold text-primary">
          <LoadingSpinner size="md" label={label} />
          <span>{label}</span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="aspect-[16/10] animate-pulse bg-secondary" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded bg-secondary" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
