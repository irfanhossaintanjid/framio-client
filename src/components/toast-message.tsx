type ToastMessageProps = {
  title: string
  description?: string
}

export function ToastMessage({ title, description }: ToastMessageProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <strong className="text-sm font-semibold">{title}</strong>
      {description ? <span className="text-sm opacity-80">{description}</span> : null}
    </div>
  )
}
