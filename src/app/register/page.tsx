import type { Metadata } from "next"

import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create your Framio account",
  description:
    "Join Framio to book verified production stages, sound studios, and creative lofts.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
