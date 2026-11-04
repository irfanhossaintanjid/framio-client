"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  MailIcon,
  ShieldCheckIcon,
  ShieldIcon,

} from "lucide-react"
import { FaGoogle } from "react-icons/fa6"
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";
import { toast } from "@/components/ui/toast"



export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 
  

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.add({
          title: "Login failed",
          description: error.message,
          type: "error",
        });
        return;
      }

      if (!data) {
        toast.add({
          title: "Login failed",
          description: "The server returned no account session.",
          type: "error",
        });
        return;
      }

      // Redirect to Home Page
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Login Error:", error);
      toast.add({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    void handleLogin(event);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-3 py-6 text-foreground sm:px-6 sm:py-10">
     

      <div className="flex w-full flex-col items-center">
        <section
          aria-labelledby="login-heading"
          className="w-full max-w-[420px] overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_16px_48px_-20px_rgba(16,42,67,0.28)]"
        >
          <div className="px-5 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[0.58rem] font-bold tracking-[0.08em] text-primary uppercase">
                <LockKeyholeIcon className="size-3" aria-hidden="true" />
                Creator &amp; Host Access
              </span>
              <h1
                id="login-heading"
                className="mt-4 text-2xl leading-tight font-bold tracking-tight text-foreground"
              >
                Log In to Framio
              </h1>
              <p className="mx-auto mt-1.5 max-w-[340px] text-xs leading-relaxed text-muted-foreground">
                Access your studio bookings, manage listings, and connect with
                creative productions.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                toast.add({
                  title: "Google login unavailable",
                  description: "Please use email and password to log in.",
                  type: "error",
                })
              }
              disabled={loading}
              className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-xs font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              <FaGoogle className="size-3.5 text-[#4285f4]" aria-hidden="true" />
              Continue with Google
            </button>

            <div className="my-4 flex items-center gap-2.5">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[0.55rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                Or Continue With Email
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form className="space-y-3" noValidate onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1 block text-[0.68rem] font-bold text-foreground"
                >
                  Email Address
                </label>
                <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-2.5 transition-colors focus-within:border-highlight focus-within:ring-2 focus-within:ring-highlight/40">
                  <MailIcon
                    className="size-3.5 shrink-0 text-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    type="email"
                name="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                required
                    disabled={loading}
                    className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <label
                    htmlFor="login-password"
                    className="text-[0.68rem] font-bold text-foreground"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      toast.add({
                        title: "Password recovery unavailable",
                        description: "Password recovery is not connected yet.",
                        type: "error",
                      })
                    }
                    disabled={loading}
                    className="text-[0.62rem] font-semibold text-primary transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-2.5 transition-colors focus-within:border-highlight focus-within:ring-2 focus-within:ring-highlight/40">
                  <LockKeyholeIcon
                    className="size-3.5 shrink-0 text-foreground"
                    aria-hidden="true"
                  />
                  <input
                       type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                    disabled={loading}
                    className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                    className=" shrink-0 rounded-sm text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-3.5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="size-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

            

              <button
                type="submit"
                disabled={loading}
                className=" group flex h-10 w-full items-center  justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {loading ? (
                  <>
                    Logging in
                    <span
                      className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRightIcon
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 border-t border-border pt-3.5 text-center">
              <p className="text-[0.65rem] text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-primary transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </section>

        <ul
          aria-label="Framio trust indicators"
          className="mt-4 flex w-full max-w-[420px] flex-wrap items-center justify-center gap-x-3 gap-y-2 px-1 text-[0.58rem] font-medium text-muted-foreground"
        >
          <li className="inline-flex items-center gap-1">
            <ShieldIcon className="size-3 shrink-0" aria-hidden="true" />
            256-bit SSL Encrypted
          </li>
          <li className="hidden text-border sm:block" aria-hidden="true">
            •
          </li>
          <li className="inline-flex items-center gap-1">
            <BadgeCheckIcon className="size-3 shrink-0" aria-hidden="true" />
            Verified Production Spaces
          </li>
          <li className="hidden text-border sm:block" aria-hidden="true">
            •
          </li>
          <li className="inline-flex items-center gap-1">
            <ShieldCheckIcon className="size-3 shrink-0" aria-hidden="true" />
            Host Protection Guarantee
          </li>
        </ul>
      </div>
    </div>
  )
}
 

 
