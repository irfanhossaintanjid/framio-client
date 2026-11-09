<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# framio-client

Framio studio-booking marketplace. Next.js 16 App Router, React 19.3, TypeScript,
Tailwind v4, shadcn `base-nova` on Base UI. No tests, CI, or formatter.
`main` is the only branch (the remote is `origin/main`).

## Commands

- `npm run dev` — dev server on :3000 (Turbopack).
- `npm run build` / `npm start` — production build and serve.
- `npm run lint` — ESLint 9 flat config over the whole repo.
- `npx eslint src/path/to/file.tsx` — lint a single file.
- `npx tsc --noEmit --incremental false` — typecheck (no script; avoids writing `.tsbuildinfo`).
- No test script exists; verify with lint + typecheck.

`npm run lint` currently fails only on two pre-existing `react-hooks/set-state-in-effect`
errors in `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`. They are vendored
code; don't treat them as regressions or rewrite generated components unless the task is
specifically about them. `tsc` is clean.

## Next.js 16 specifics

- `next.config.ts` sets `cacheComponents: false` and `partialPrefetching: false` (do not assume
  PPR / `use cache` behavior), `reactCompiler: true`, and a Turbopack CSS rule using
  `@tailwindcss/turbopack`. Read the version-matched docs in `node_modules/next/dist/docs/`
  before changing routing, caching, or rendering.
- `params` and `searchParams` are Promises. `layout.tsx` uses the generated `LayoutProps<"/">`
  helper; run `npx next typegen` if those global types are missing.
- Use `proxy.ts` / `export function proxy`, not `middleware.ts`, for request interception.
- There is no `images.remotePatterns`; every remote `next/image` render uses `unoptimized`.
  Keep doing that (or configure `remotePatterns` first).
- `next dev` owns the `nextjs-agent-rules` block above. Keep it; Next.js preserves the rest
  of this file when updating it.

## Architecture: two backends

The app is no longer client-only. Requests split between a sibling Express API and MongoDB
accessed directly from Next route handlers:

- **Express API** (`NEXT_PUBLIC_API_URL`, default `http://localhost:8000`, not 5000) handles
  studio detail/CUD and bookings:
  - `/studios/[id]` — server component fetches `GET /studio/:id`.
  - `/add-studio` and `/studios/edit/[id]` — `POST /add-studios`, `PATCH /studio/:id`.
  - `/my-listings` — `GET /my-studios/:email`, `DELETE /studio/:id`.
  - `/api/bookings/*` — same-origin Next routes that authenticate, then proxy to the Express
    `GET/POST /booking*` endpoints. They require `FRAMIO_INTERNAL_API_SECRET` (otherwise 503)
    and send `x-framio-internal-secret`, `x-framio-user-email`, `x-framio-user-name`.
    `FRAMIO_SERVER_URL` overrides the target. Never call those Express booking endpoints
    directly from the browser.
- **MongoDB** via `db` from `@/lib/auth` (database name is hardcoded to `Framio`) backs:
  - `/api/auth/[...all]` — Better Auth (`auth` in `@/lib/auth`, `authClient` in `auth-client.ts`).
  - `/api/studios` and `/api/studios/[id]` — studio reads.
  - `/api/wishlist` and `/api/wishlist/[studioId]` — `savedStudios`, keyed by normalized email
    + studioId with a unique index created on first use.

Because list/detail views read from different backends, keep API and Mongo document shapes
compatible with `src/lib/types/page.ts` (`_id` may be a string or `{ $oid }`).

## Auth and data fetching

- Server: `auth.api.getSession({ headers: request.headers })` in route handlers, or
  `headers()` from `next/headers` in server pages. Client: `authClient.useSession()`.
- Same-origin API calls use `credentials: "include"`; direct Express calls use
  `credentials: "omit"` and pass the owner email in the URL/body.
- Most pages are client components that fetch in `useEffect` with an `AbortController`;
  only `studios/[id]` (and metadata) fetch on the server.
- Only email/password auth is enabled. The "Continue with Google" buttons on `/login` and
  `/register` are stubs that show a toast.
- `.env` is gitignored. Required keys: `MONGODB_URI`, `BETTER_AUTH_URL`,
  `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_API_URL`, `FRAMIO_INTERNAL_API_SECRET`.
  `NEXT_PUBLIC_*` values are exposed to the browser.

## UI and styling

- `src/components/ui/*` is vendored shadcn (`components.json` style `base-nova`) built on
  `@base-ui/react`, not Radix. Use Base UI conventions: `render={<Component />}` instead of
  `asChild`, no `forwardRef`, and `data-slot` attributes. Add primitives with
  `npx shadcn add <component>` rather than hand-writing or pasting Radix versions.
- Import `cn` from `"cn"` (as the UI files do). `@/lib/utils` only re-exports it.
- Tailwind v4 is CSS-first: theme tokens and dark mode live in `src/app/globals.css`; there is
  no `tailwind.config.*`. Reuse existing tokens (`bg-background`, `text-muted-foreground`,
  `bg-primary`, `font-heading`, etc.).
- Theme is a custom `dark` class on `<html>` persisted in `localStorage` under `framio-theme`
  by `theme-initializer.tsx` / the navbar toggle; there is no `next-themes`.
- Path alias: `@/*` → `src/*`.

## Layout

- `src/app` — App Router routes and route handlers; `layout.tsx` renders the global
  `Navbar`, `Footer`, and `Toaster`.
- `src/components/{homepage,studios,studio-details,booking}` — feature components;
  `src/components/ui` — generated primitives, keep close to upstream.
- `src/lib` — auth, booking types/invoice, wishlist Mongo helpers, studio formatting helpers,
  and shared types (`src/lib/types/page.ts`).
- `src/lib/highlighter.tsx` — lazy Shiki highlighter; register new languages in its
  `languages` array and `aliases` map.
- `README.md` is untouched create-next-app boilerplate; trust `package.json` and `src/`.
