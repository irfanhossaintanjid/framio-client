"use client"

import { HeartIcon, Loader2Icon } from "lucide-react"
import { useState } from "react"

import { toast } from "react-toastify"
import { ToastMessage } from "@/components/toast-message"
import { authClient } from "@/lib/auth-client"

export function SaveButton({
  studioId,
  initialSaved = false,
  onSavedChange,
  variant = "floating",
  showLabel = false,
}: {
  studioId: string
  initialSaved?: boolean
  onSavedChange?: (saved: boolean) => void
  variant?: "floating" | "inline"
  showLabel?: boolean
}) {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [saved, setSaved] = useState(initialSaved)
  const [isSaving, setIsSaving] = useState(false)

  async function toggleSaved() {
    if (isSaving) return

    if (sessionPending || !session?.user?.email) {
      toast.info(<ToastMessage title="Log in to save studios" description="Sign in to keep this studio in your wishlist." />)
      return
    }

    const nextSaved = !saved
    setSaved(nextSaved)
    onSavedChange?.(nextSaved)
    setIsSaving(true)

    try {
      const response = await fetch(
        nextSaved ? "/api/wishlist" : `/api/wishlist/${encodeURIComponent(studioId)}`,
        {
          method: nextSaved ? "POST" : "DELETE",
          headers: nextSaved ? { "Content-Type": "application/json" } : undefined,
          credentials: "include",
          body: nextSaved ? JSON.stringify({ studioId }) : undefined,
        },
      )

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(errorBody?.error ?? "Unable to update saved studios.")
      }
    } catch (error) {
      setSaved(!nextSaved)
      onSavedChange?.(!nextSaved)
      toast.error(<ToastMessage title="Unable to update saved studios" description={error instanceof Error ? error.message : "Please try again."} />)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <button
      type="button"
      aria-label={saved ? "Remove studio from saved studios" : "Save studio"}
      aria-pressed={saved}
      disabled={isSaving}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void toggleSaved()
      }}
      className={
        variant === "floating"
          ? "absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-70"
          : "inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-70"
      }
    >
      {isSaving ? (
        <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <HeartIcon
          className={`size-4 transition-colors ${saved ? "fill-primary text-primary" : ""}`}
          aria-hidden="true"
        />
      )}
      {showLabel ? (isSaving ? "Saving…" : "Save") : null}
    </button>
  )
}
