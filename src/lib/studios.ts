export type Discipline = "Photography" | "Music" | "Film" | "Design"

export type Studio = {
  id: string
  name: string
  discipline: Discipline
  location: string
  rating: number
  reviews: number
  price: number
  instant: boolean
  featured?: boolean
  capacity: number
  host: string
  responseTime: string
  description: string
  amenities: string[]
}

export const studios: Studio[] = [
  {
    id: "northlight",
    name: "Northlight Studio",
    discipline: "Photography",
    location: "Brooklyn, NY",
    rating: 4.9,
    reviews: 128,
    price: 85,
    instant: true,
    featured: true,
    capacity: 8,
    host: "Mara Chen",
    responseTime: "within 1 hour",
    description:
      "A quiet daylight studio with 14-foot windows, warm oak floors, and a flexible white-wall cove. Built for editorial, portrait, and product work.",
    amenities: [
      "Natural daylight",
      "White-wall cove",
      "Profoto lighting",
      "Hair & makeup station",
      "Freight elevator",
    ],
  },
  {
    id: "sound-room",
    name: "The Sound Room",
    discipline: "Music",
    location: "Austin, TX",
    rating: 4.8,
    reviews: 94,
    price: 65,
    instant: true,
    capacity: 6,
    host: "Devon Ellis",
    responseTime: "within 2 hours",
    description:
      "A treated live room and control room for tracking, mixing, and podcast sessions. Vintage outboard gear, a grand piano, and a fast engineer on call.",
    amenities: [
      "Live room + control room",
      "Vintage outboard gear",
      "Grand piano",
      "Pro Tools rig",
      "Lounge & kitchen",
    ],
  },
  {
    id: "meridian",
    name: "Meridian Film Stage",
    discipline: "Film",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviews: 76,
    price: 140,
    instant: false,
    capacity: 24,
    host: "Priya Raman",
    responseTime: "within 3 hours",
    description:
      "A full-height cyclorama stage with rigging, silent HVAC, and a loading dock. Ideal for commercials, music videos, and product shoots.",
    amenities: [
      "Full cyclorama",
      "Rigging grid",
      "Silent HVAC",
      "Loading dock",
      "Green room",
    ],
  },
  {
    id: "atelier-nine",
    name: "Atelier Nine",
    discipline: "Design",
    location: "Portland, OR",
    rating: 4.7,
    reviews: 61,
    price: 55,
    instant: true,
    capacity: 10,
    host: "Jonah Park",
    responseTime: "within 1 hour",
    description:
      "A bright workshop and presentation space for design sprints, small launches, and content days. Modular tables, pin-up walls, and excellent coffee.",
    amenities: [
      "Modular worktables",
      "Pin-up walls",
      "Presentation display",
      "Fast Wi-Fi",
      "Espresso bar",
    ],
  },
  {
    id: "blue-hour",
    name: "Blue Hour Loft",
    discipline: "Photography",
    location: "Chicago, IL",
    rating: 4.9,
    reviews: 143,
    price: 95,
    instant: true,
    capacity: 12,
    host: "Elena Voss",
    responseTime: "within 30 minutes",
    description:
      "A west-facing loft that turns golden at sunset. Exposed brick, a styling rack, and a separate client lounge make it an easy all-day base.",
    amenities: [
      "Sunset-facing windows",
      "Exposed brick",
      "Styling rack",
      "Client lounge",
      "Blackout curtains",
    ],
  },
  {
    id: "resonance",
    name: "Resonance Lab",
    discipline: "Music",
    location: "Seattle, WA",
    rating: 4.8,
    reviews: 88,
    price: 72,
    instant: false,
    capacity: 8,
    host: "Theo Brooks",
    responseTime: "within 2 hours",
    description:
      "A compact writing and production room with a deep synth collection, treated monitoring, and a comfortable couch for long sessions.",
    amenities: [
      "Treated monitoring",
      "Synth collection",
      "Vocal booth",
      "MIDI controllers",
      "Kitchenette",
    ],
  },
]

export const disciplineOptions = [
  "All disciplines",
  "Photography",
  "Music",
  "Film",
  "Design",
] as const

export const locationOptions = [
  "All locations",
  "Brooklyn, NY",
  "Austin, TX",
  "Los Angeles, CA",
  "Portland, OR",
  "Chicago, IL",
  "Seattle, WA",
] as const

export const sortOptions = [
  { value: "featured", label: "Featured first" },
  { value: "rating", label: "Highest rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const
