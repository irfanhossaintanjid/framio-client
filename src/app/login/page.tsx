import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign in to Framio",
  description:
    "Sign in to manage your studio bookings and access verified production spaces.",
}

export default function LoginPage() {
  return <LoginForm />
}
