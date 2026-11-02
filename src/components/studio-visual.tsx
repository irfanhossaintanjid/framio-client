import { CameraIcon, ClapperboardIcon, Music2Icon, PaletteIcon } from "lucide-react"
import { cn } from "cn"

import type { Discipline } from "@/lib/studios"

const visuals: Record<
  Discipline,
  { icon: typeof CameraIcon; gradient: string }
> = {
  Photography: {
    icon: CameraIcon,
    gradient: "from-primary/25 via-card to-highlight/15",
  },
  Music: {
    icon: Music2Icon,
    gradient: "from-highlight/20 via-card to-primary/20",
  },
  Film: {
    icon: ClapperboardIcon,
    gradient: "from-primary/20 via-card to-foreground/15",
  },
  Design: {
    icon: PaletteIcon,
    gradient: "from-highlight/15 via-card to-primary/10",
  },
}

export function StudioVisual({
  discipline,
  className,
}: {
  discipline: Discipline
  className?: string
}) {
  const { icon: Icon, gradient } = visuals[discipline]

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
      aria-hidden="true"
    >
      <div className="studio-grid absolute inset-0 opacity-60" />
      <div className="absolute -top-10 -right-10 size-40 rounded-full bg-highlight/10 blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-20 items-center justify-center rounded-2xl border border-border/70 bg-card/70 shadow-lg backdrop-blur-sm">
          <Icon
            className="size-9 text-primary dark:text-highlight"
            strokeWidth={1.5}
          />
        </span>
      </div>
    </div>
  )
}
