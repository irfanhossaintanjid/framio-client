"use client"

import * as React from "react"
import { ArrowUpRightIcon, MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterForm() {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address to subscribe.")
      return
    }

    setError(null)
    setEmail("")
    toast.add({
      title: "You're on the list",
      description: "Studio drops and hosting tips are on the way.",
      type: "success",
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-md flex-col gap-2"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <MailIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (error) setError(null)
            }}
            placeholder="Get studio booking tips"
            className="pl-8"
            aria-label="Email for updates"
            aria-invalid={Boolean(error)}
            aria-describedby="newsletter-error"
          />
        </div>
        <Button type="submit">
          Subscribe
          <ArrowUpRightIcon aria-hidden="true" />
        </Button>
      </div>
      <FieldError id="newsletter-error" aria-live="polite">
        {error}
      </FieldError>
    </form>
  )
}
