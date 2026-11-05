"use client"

import { createContext, useContext } from "react"

const StudioIdContext = createContext<string | undefined>(undefined)

export function StudioIdProvider({
  studioId,
  children,
}: {
  studioId: string
  children: React.ReactNode
}) {
  return (
    <StudioIdContext.Provider value={studioId}>
      {children}
    </StudioIdContext.Provider>
  )
}

export function useStudioId() {
  return useContext(StudioIdContext)
}
