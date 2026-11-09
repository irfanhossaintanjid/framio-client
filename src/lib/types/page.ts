export type NavbarUser = {
  name: string
  image?: string
  email: string
}

export type ResponsiveNavbarProps =
  | { user?: null; onLogout?: never }
  | { user: NavbarUser; onLogout: () => void }



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
  ownerImage? :string
  isSaved?: boolean
}


export type StudioId = string | { $oid: string }

export type SavedStudio = {
  _id: string
  userEmail: string
  studioId: string
  savedAt: string
}

export type StudioReview = {
  _id?: string
  userName?: string
  userPhoto?: string
  rating: number
  comment: string
  createdAt?: string
  ratings?: {
    cleanliness?: number
    communication?: number
    gear?: number
    acoustics?: number
  }
}

export type StudioDetails = {
  _id: StudioId
  title?: string
  tagline?: string
  hourlyRate?: string | number
  securityDeposit?: string | number
  minimumDuration?: string | number
  crewCapacity?: string | number
  squareFootage?: string | number
  address?: string
  coverImageUrl?: string
  galleryImages?: string[]
  description?: string
  category?: string
  amenities?: string[]
  rating?: string | number
  ownerName?: string
  ownerEmail?: string
  ownerPhoto?: string
  createdAt?: string
  ownerImage?: string
  reviews?: StudioReview[]
  isSaved?: boolean
}
