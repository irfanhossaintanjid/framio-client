import { cn } from "cn"
import { Loader2Icon } from "lucide-react"

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg"
  label?: string
  fullScreen?: boolean
  className?: string
}

const spinnerSizes = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-8",
}

function LoadingSpinner({
  size = "md",
  label = "Loading",
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <Loader2Icon
      data-slot="loading-spinner"
      className={cn(spinnerSizes[size], "animate-spin motion-reduce:animate-none", className)}
      aria-hidden="true"
    />
  )

  if (fullScreen) {
    return (
      <div
        className="flex min-h-dvh items-center justify-center bg-background text-primary"
        role="status"
        aria-live="polite"
      >
        {spinner}
        <span className="sr-only">{label}</span>
      </div>
    )
  }

  return (
    <span className="inline-flex items-center justify-center text-primary" role="status" aria-live="polite">
      {spinner}
      <span className="sr-only">{label}</span>
    </span>
  )
}

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { LoadingSpinner, Spinner }
