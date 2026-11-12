"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"
import { LoadingSpinner } from "@/components/ui/spinner"

function LoadedImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <Image
        {...props}
        alt={props.alt}
        onLoad={(event) => {
          setLoaded(true)
          props.onLoad?.(event)
        }}
        onError={(event) => {
          setLoaded(true)
          props.onError?.(event)
        }}
      />
      {!loaded ? (
        <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-secondary/70" role="status" aria-label="Loading image">
          <LoadingSpinner size="md" label="Loading image" />
        </span>
      ) : null}
    </>
  )
}

export function ImageWithLoader(props: ImageProps) {
  return <LoadedImage key={String(props.src)} {...props} />
}
