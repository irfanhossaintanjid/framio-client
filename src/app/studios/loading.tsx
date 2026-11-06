import { LoadingSpinner } from "@/components/ui/spinner"

export default function StudiosLoading() {
  return (
    <div className="flex min-h-[50dvh] items-center justify-center bg-background px-4 text-foreground">
      <LoadingSpinner size="lg" label="Loading studios" />
    </div>
  )
}
