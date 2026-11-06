export type NavbarUser = {
  name: string
  image?: string
  email: string
}

export type ResponsiveNavbarProps =
  | { user?: null; onLogout?: never }
  | { user: NavbarUser; onLogout: () => void }

type StudioId = string | { $oid: string }


export type Studio = {
  _id: StudioId
  title?: string
  category?: string
  tagline?: string
  hourlyRate?: string | number
  coverImageUrl?: string
  address?: string
  squareFootage?: string | number
  description?: string
  rating?: string | number
  averageRating?: string | number
  avgRating?: string | number
  createdAt?: string | number | Date
  gearSummary?: string
}