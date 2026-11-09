"use client"

import { useEffect, useState } from "react"
import { HeartIcon } from "lucide-react"
import Link from "next/link"

import {
  StudioCard,
  StudioCardSkeleton,
  getStudioId,
} from "@/components/homepage/featured-studios"
import { authClient } from "@/lib/auth-client"
import type { Studio } from "@/lib/types/page"

export function SavedStudiosPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [studios, setStudios] = useState<Studio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)
  const userEmail = session?.user?.email

  useEffect(() => {
    if (sessionPending || !userEmail) return

    const controller = new AbortController()
    async function loadSavedStudios() {
      try {
        const response = await fetch("/api/wishlist", {
          credentials: "include",
          signal: controller.signal,
        })
        const body = (await response.json().catch(() => null)) as
          | Studio[]
          | { error?: string }
          | null
        if (!response.ok) {
          throw new Error(
            body && !Array.isArray(body) && body.error
              ? body.error
              : `Unable to load saved studios (${response.status}).`,
          )
        }
        setStudios(Array.isArray(body) ? body : [])
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load saved studios.",
          )
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadSavedStudios()
    return () => controller.abort()
  }, [retry, sessionPending, userEmail])

  if (sessionPending || (userEmail && isLoading)) {
    return (
      <main className="min-h-dvh bg-background px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-20 animate-pulse rounded-xl bg-secondary" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <StudioCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!userEmail) {
    return (
      <main className="flex min-h-[70dvh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <HeartIcon className="mx-auto size-12 text-primary" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Log in to view saved studios
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Save creative spaces and find them here whenever you need them.
          </p>
          <Link
            href="/login?redirect=/saved-studios"
            className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Log In
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
            Your Wishlist
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Saved Studios
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep your favorite creative spaces close for your next project.
          </p>
        </header>

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-card px-6 py-12 text-center">
            <h2 className="font-bold text-destructive">Unable to load saved studios</h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null)
                setIsLoading(true)
                setRetry((value) => value + 1)
              }}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Try Again
            </button>
          </div>
        ) : studios.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <HeartIcon className="mx-auto size-12 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold">No Saved Studios Yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Tap the heart on any studio to save it here.
            </p>
            <Link
              href="/studios"
              className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Explore Studios
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard
                key={getStudioId(studio)}
                studio={studio}
                onSavedChange={(saved) => {
                  if (!saved) {
                    setStudios((current) =>
                      current.filter((item) => getStudioId(item) !== getStudioId(studio)),
                    )
                  } else {
                    setStudios((current) =>
                      current.some((item) => getStudioId(item) === getStudioId(studio))
                        ? current
                        : [studio, ...current],
                    )
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
