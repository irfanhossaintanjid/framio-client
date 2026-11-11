"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Building2Icon,
  ExternalLinkIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  RulerIcon,
  Trash2Icon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { formatMoney, numberValue, studioId } from "@/lib/studio-details";
import type { StudioDetails } from "@/lib/types/page";

function formatRating(value?: string | number) {
  const rating = Number(value);
  return Number.isFinite(rating) && rating > 0 ? rating.toFixed(2) : "New";
}

function reviewCount(studio: StudioDetails) {
  return studio.reviews?.length ?? 0;
}

function ListingSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 rounded-xl border border-border bg-card p-4 lg:grid-cols-[240px_minmax(0,1fr)_160px]">
      <div className="aspect-[16/10] rounded-lg bg-secondary" />
      <div className="space-y-4">
        <div className="h-5 w-3/5 rounded bg-secondary" />
        <div className="h-3 w-4/5 rounded bg-secondary" />
        <div className="h-4 w-full rounded bg-secondary" />
        <div className="h-4 w-2/3 rounded bg-secondary" />
      </div>
      <div className="h-24 rounded bg-secondary" />
    </div>
  );
}

function ListingCard({
  studio,
  onDelete,
}: {
  studio: StudioDetails;
  onDelete: () => void;
}) {
  const id = studioId(studio);
  const reviews = reviewCount(studio);

  return (
    <article className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 lg:grid-cols-[240px_minmax(0,1fr)_160px] lg:items-center">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-secondary">
        <Image
          src={studio.coverImageUrl ?? "/images/hero/daylight-studio.jpg"}
          alt={studio.title ? `${studio.title} cover` : "Studio cover"}
          fill
          unoptimized
          sizes="(max-width: 1023px) 100vw, 240px"
          className="object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded bg-foreground/85 px-2 py-1 text-[0.625rem] font-bold tracking-wide text-background uppercase">
          {studio.category ?? "Studio"}
        </span>
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-foreground">
          {studio.title ?? "Untitled Studio"}
        </h2>
        <p className="mt-1 flex items-start gap-1 text-sm text-muted-foreground">
          <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
          <span className="truncate">
            {studio.address ?? "Address unavailable"}
          </span>
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <span className="text-lg font-bold text-primary">
            {formatMoney(studio.hourlyRate)}
            <span className="ml-0.5 text-xs font-medium text-muted-foreground">
              /hr
            </span>
          </span>
          <span aria-hidden="true">•</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            ★ {formatRating(studio.rating)}
          </span>
          <span>
            ({reviews} review{reviews === 1 ? "" : "s"})
          </span>
          {studio.squareFootage ? (
            <>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1">
                <RulerIcon className="size-3.5" />
                {numberValue(studio.squareFootage).toLocaleString()} sq ft
              </span>
            </>
          ) : null}
          {studio.crewCapacity ? (
            <>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1">
                <UsersIcon className="size-3.5" />
                Up to {numberValue(studio.crewCapacity)} Crew
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs sm:grid-cols-3 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pl-4 lg:pt-0">
        <Link
          href={`/studios/${id}`}
          className="inline-flex items-center justify-center gap-1 rounded-md px-2 py-2 font-semibold text-primary hover:bg-secondary"
        >
          View Details <ExternalLinkIcon className="size-3.5" />
        </Link>
        <Link
          href={`/studios/edit/${id}`}
          className="inline-flex items-center justify-center gap-1 rounded-md bg-secondary px-2 py-2 font-semibold text-primary hover:bg-accent"
        >
          <PencilIcon className="size-3.5" /> Update
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-1 rounded-md px-2 py-2 font-semibold text-destructive hover:bg-destructive/5"
        >
          <Trash2Icon className="size-3.5" /> Delete
        </button>
      </div>
    </article>
  );
}

export function MyStudioListingsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const email = session?.user?.email ?? "";
  const [studios, setStudios] = useState<StudioDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<StudioDetails | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (sessionPending || !email) return;
    const controller = new AbortController();
    fetch("/api/my-listings", {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            (await response.text()) ||
              `Unable to load listings (${response.status}).`,
          );
        }
        return response.json() as Promise<StudioDetails[]>;
      })
      .then((data) => setStudios(Array.isArray(data) ? data : []))
      .catch((loadError) => {
        if (!controller.signal.aborted)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load listings.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [email, retry, sessionPending]);

  const activeCount = useMemo(() => studios.length, [studios]);

  async function deleteStudio() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const id = studioId(deleteTarget);
      const response = await fetch(`/api/studios/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(
          (await response.json().catch(() => null))?.error ??
            "Unable to delete studio.",
        );
      }
      setStudios((current) =>
        current.filter((studio) => studioId(studio) !== id),
      );
      setDeleteTarget(null);
      toast.add({
        title: "Studio deleted",
        description: "Your studio listing was deleted successfully. ",
        type: "success",
      });
    } catch (deleteError) {
      toast.add({
        title: "Delete failed",
        description:
          deleteError instanceof Error
            ? deleteError.message
            : "Please try again.",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  }

  if (sessionPending || (Boolean(email) && loading)) {
    return (
      <main className="min-h-dvh bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-20 animate-pulse rounded-xl bg-secondary" />
          <div className="space-y-3">
            <ListingSkeleton />
            <ListingSkeleton />
            <ListingSkeleton />
          </div>
        </div>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="flex min-h-[70dvh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <Building2Icon className="mx-auto size-10 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">
            Please log in to manage your studios
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your creative spaces will appear here after you sign in.
          </p>
          <Link
            href="/login?redirect=/my-listings"
            className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Log In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <span>Host Studio</span>
          <span aria-hidden="true">›</span>
          <span className="font-semibold text-foreground">
            My Studio Listings 
          </span>
        </nav>
        <header className="flex flex-col gap-5 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Studio Listings
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your creative spaces and keep your listings up to date.
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {activeCount} Active Listing{activeCount === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            href="/add-studio"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            <PlusIcon className="size-4" /> Add New Studio
          </Link>
        </header>
        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-card px-6 py-12 text-center">
            <h2 className="font-bold text-destructive">
              Unable to load your listings
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setLoading(true);
                setRetry((value) => value + 1);
              }}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Retry
            </button>
          </div>
        ) : studios.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Building2Icon className="mx-auto size-12 text-primary" />
            <h2 className="mt-4 text-xl font-bold">No Studios Listed Yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your creative spaces deserve to be discovered. Start by adding
              your first studio.
            </p>
            <Link
              href="/add-studio"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <PlusIcon className="size-4" /> Add Your First Studio
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {studios.map((studio) => (
              <ListingCard
                key={studioId(studio)}
                studio={studio}
                onDelete={() => setDeleteTarget(studio)}
              />
            ))}
          </div>
        )}
      </div>
      {deleteTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-studio-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="delete-studio-title" className="text-lg font-bold">
                  Delete Studio Listing?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Are you sure you want to delete{" "}
                  <strong className="text-foreground">
                    {deleteTarget.title ?? "this studio"}
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                aria-label="Close delete dialog"
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void deleteStudio()}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Studio"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
