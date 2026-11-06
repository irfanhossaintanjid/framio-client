import { LoadingSpinner } from "@/components/ui/spinner"

export default function StudioDetailsLoading() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center bg-background px-4 text-foreground">
      <LoadingSpinner size="lg" label="Loading studio details" />
    </div>
  )
}
