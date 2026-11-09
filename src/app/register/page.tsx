"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  LockKeyholeIcon,
  LogInIcon,
  MailIcon,
  UserRoundIcon,
} from "lucide-react"
import { FaGoogle } from "react-icons/fa6"

import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { LoadingSpinner } from "@/components/ui/spinner"

const passwordRules = [
  { label: "6+ characters", test: (value: string) => value.length >= 6 },
  { label: "Uppercase (A-Z)", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Lowercase (a-z)", test: (value: string) => /[a-z]/.test(value) },
]

type FieldName = "fullName" | "email" | "password" | "photoUrl"

function isValidImageUrl(value: string) {
  if (!value.trim()) return true

  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

export function RegisterForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})

  const passedRules = passwordRules.map((rule) => ({
    label: rule.label,
    passed: rule.test(password),
  }))
  const passwordIsValid = passedRules.every((rule) => rule.passed)
  const avatarPreview = isValidImageUrl(photoUrl) ? photoUrl.trim() : ""

  function validateField(field: FieldName, value: string) {
    let error = ""

    if (field === "fullName" && !value.trim()) {
      error = "Enter your full name."
    } else if (
      field === "email" &&
      (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    ) {
      error = "Enter a valid email address."
    } else if (field === "password" && !passwordRules.every((rule) => rule.test(value))) {
      error = "Use at least 6 characters, including uppercase and lowercase letters."
    } else if (field === "photoUrl" && !isValidImageUrl(value)) {
      error = "Enter a valid HTTP or HTTPS image URL."
    }

    setErrors((current) => ({ ...current, [field]: error }))
    return !error
  }

  function updateField(field: FieldName, value: string) {
    if (field === "fullName") setFullName(value)
    if (field === "email") setEmail(value)
    if (field === "photoUrl") setPhotoUrl(value)
    if (field === "password") setPassword(value)
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }))
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const isNameValid = validateField("fullName", fullName)
    const isEmailValid = validateField("email", email)
    const isPasswordValid = validateField("password", password)
    const isPhotoUrlValid = validateField("photoUrl", photoUrl)

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isPhotoUrlValid) {
      return
    }

    setIsSubmitting(true)
    try {
      const { data, error } = await authClient.signUp.email({
        name: fullName.trim(),
        email: email.trim(),
        password,
        image: photoUrl.trim() || undefined,
      })

      if (error) {
        toast.add({
          title: "Registration failed",
          description: error.message,
          type: "error",
        })
        return
      }

      if (!data) {
        toast.add({
          title: "Registration failed",
          description: "The server returned no account confirmation.",
          type: "error",
        })
        return
      }

      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Registration error:", error)
      toast.add({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function showUnavailableMessage() {
    toast.add({
      title: "Google sign-up unavailable",
      description: "Please create your account with email and password.",
      type: "error",
    })
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-3 py-6 text-foreground sm:px-6 sm:py-10">
      <section
        aria-labelledby="register-heading"
        className="w-full max-w-[420px] overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_16px_48px_-20px_rgba(16,42,67,0.28)]"
      >
        <div className="px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[0.55rem] font-bold tracking-[0.08em] text-secondary-foreground uppercase">
              <span className="size-1.5 rounded-full bg-highlight" aria-hidden="true" />
              Creator Network Onboarding
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[0.58rem] font-medium text-muted-foreground">
              <LockKeyholeIcon className="size-3 text-primary" aria-hidden="true" />
              256-Bit SSL
            </span>
          </div>

          <h1
            id="register-heading"
            className="mt-5 font-heading text-[1.7rem] leading-tight font-bold tracking-tight text-foreground"
          >
            Create your Framio account
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Book verified production stages, sound studios, and creative lofts
            across the country with instant direct clearance.
          </p>

          <button
            type="button"
            onClick={showUnavailableMessage}
            disabled={isSubmitting}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            <FaGoogle className="size-4 text-[#4285f4]" aria-hidden="true" />
            Continue with Google
          </button>

          <div className="my-4 flex items-center gap-2.5">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[0.55rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Or sign up with email
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-3" noValidate onSubmit={handleSubmit}>
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <label htmlFor="full-name" className="text-[0.68rem] font-bold text-foreground">
                  Full Name
                </label>
                <span className="text-[0.6rem] text-muted-foreground">
                  Director or Host name
                </span>
              </div>
              <div
                className={`flex h-10 items-center gap-2 rounded-lg border bg-secondary px-2.5 transition-colors focus-within:ring-2 focus-within:ring-highlight ${
                  errors.fullName ? "border-destructive" : "border-transparent"
                }`}
              >
                <UserRoundIcon
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="full-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  onBlur={(event) => validateField("fullName", event.target.value)}
                  placeholder="Elena Rostova"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? "full-name-error" : undefined}
                  disabled={isSubmitting}
                  className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
                />
              </div>
              {errors.fullName ? (
                <p id="full-name-error" className="mt-1 text-[0.65rem] text-destructive">
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-[0.68rem] font-bold text-foreground">
                Email Address
              </label>
              <div
                className={`flex h-10 items-center gap-2 rounded-lg border bg-secondary px-2.5 transition-colors focus-within:ring-2 focus-within:ring-highlight ${
                  errors.email ? "border-destructive" : "border-transparent"
                }`}
              >
                <MailIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => updateField("email", event.target.value)}
                  onBlur={(event) => validateField("email", event.target.value)}
                  placeholder="name@agency.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  disabled={isSubmitting}
                  className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
                />
              </div>
              {errors.email ? (
                <p id="email-error" className="mt-1 text-[0.65rem] text-destructive">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <label htmlFor="profile-photo" className="text-[0.68rem] font-bold text-foreground">
                  Profile Photo URL{" "}
                  <span className="font-normal text-muted-foreground">(Optional)</span>
                </label>
                <span className="text-[0.6rem] font-bold text-primary">Live Avatar</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-secondary px-2.5 transition-colors focus-within:ring-2 focus-within:ring-highlight ${
                    errors.photoUrl ? "border-destructive" : "border-transparent"
                  }`}
                >
                  <ImageIcon
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="profile-photo"
                    name="image"
                    type="url"
                    autoComplete="url"
                    value={photoUrl}
                    onChange={(event) => updateField("photoUrl", event.target.value)}
                    onBlur={(event) => validateField("photoUrl", event.target.value)}
                    placeholder="https://images.unsplash.com/your-creator-photo.jpg"
                    aria-invalid={Boolean(errors.photoUrl)}
                    aria-describedby={errors.photoUrl ? "photo-url-error" : undefined}
                    disabled={isSubmitting}
                    className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
                  />
                </div>
                <div
                  aria-label={avatarPreview ? "Profile photo preview" : "Photo preview"}
                  className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary"
                >
                  {avatarPreview ? (
                    // This is a user-provided preview URL, not a site asset.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRoundIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </div>
              </div>
              {errors.photoUrl ? (
                <p id="photo-url-error" className="mt-1 text-[0.65rem] text-destructive">
                  {errors.photoUrl}
                </p>
              ) : (
                <p className="mt-1 text-[0.6rem] leading-relaxed text-muted-foreground">
                  Used on verified listing bookings and creator messages.
                </p>
              )}
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <label htmlFor="password" className="text-[0.68rem] font-bold text-foreground">
                  Password
                </label>
                <span className="text-[0.6rem] text-muted-foreground">Encrypted entry</span>
              </div>
              <div
                className={`flex h-10 items-center gap-2 rounded-lg border bg-secondary px-2.5 transition-colors focus-within:ring-2 focus-within:ring-highlight ${
                  errors.password ? "border-destructive" : "border-transparent"
                }`}
              >
                <LockKeyholeIcon
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => updateField("password", event.target.value)}
                  onBlur={(event) => validateField("password", event.target.value)}
                  placeholder="••••••••••••"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  disabled={isSubmitting}
                  className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isSubmitting}
                  className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-3.5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="size-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p id="password-error" className="mt-1 text-[0.65rem] text-destructive">
                  {errors.password}
                </p>
              ) : null}
            </div>

            <div className="rounded-lg bg-secondary px-2.5 py-2.5">
              <p className="text-[0.55rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                Security strength checklist:
              </p>
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-2 sm:justify-between sm:gap-x-2">
                {passedRules.map(({ label, passed }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1 text-[0.57rem] text-muted-foreground"
                  >
                    <span
                      className={`flex size-3.5 shrink-0 items-center justify-center rounded-full border ${
                        passed
                          ? "border-highlight bg-highlight text-white"
                          : "border-muted-foreground/60"
                      }`}
                    >
                      {passed ? <CheckIcon className="size-2.5" aria-hidden="true" /> : null}
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              disabled={!passwordIsValid || isSubmitting}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              {isSubmitting ? (
                <>
                  Creating account <LoadingSpinner size="sm" label="Creating account" className="text-primary-foreground" />
                </>
              ) : (
                <>
                  Register as Creator
                  <ArrowRightIcon
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-border bg-secondary px-5 py-3.5 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="inline-flex items-center gap-1.5 text-[0.62rem] text-muted-foreground">
            <LogInIcon className="size-3 shrink-0" aria-hidden="true" />
            Already have a Framio account?
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-[0.62rem] font-bold text-primary transition-colors hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Sign in instead
            <ArrowRightIcon className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function RegisterPage() {
  return <RegisterForm />
}