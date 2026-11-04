export type NavbarUser = {
  name: string
  avatarUrl?: string
}

export type ResponsiveNavbarProps =
  | { user?: null; onLogout?: never }
  | { user: NavbarUser; onLogout: () => void }


  