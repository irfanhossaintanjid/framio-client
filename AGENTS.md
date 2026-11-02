<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# framio-client

Client-only Next.js 16 App Router app (React 19, TypeScript, Tailwind v4, shadcn `base-nova` on Base UI).
No tests, CI, or formatter are configured. `master` is the only branch.

## Commands

- `npm run dev` — dev server on :3000 (Turbopack).
- `npm run build` / `npm start` — production build and serve.
- `npm run lint` — ESLint 9 flat config over the whole repo.
- `npx eslint src/path/to/file.tsx` — lint a single file.
- `npx tsc --noEmit --incremental false` — typecheck (no script; avoids writing `.tsbuildinfo`).

Lint currently reports two pre-existing `react-hooks/set-state-in-effect` errors in
`src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`. They come from vendored
shadcn code; don't treat them as regressions or rewrite generated components unless the task
is specifically about them.

## Next.js 16 specifics

- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler`.
  Read the version-matched docs in `node_modules/next/dist/docs/` before changing routing,
  caching, or rendering code.
- With `cacheComponents`, data fetching is dynamic by default and PPR is always on. Opt in
  with `use cache` / `cacheLife` / `cacheTag`. Do not add `experimental.ppr`,
  `experimental_ppr`, or a `runtime` route export (unsupported).
- `params` and `searchParams` are Promises. `layout.tsx` uses the generated
  `LayoutProps<"/">` helper; run `npx next typegen` if those global types are missing.
- Use `proxy.ts` / `export function proxy`, not `middleware.ts`, for request interception.
- `next dev` owns the `nextjs-agent-rules` block above. Keep it; Next.js preserves the rest
  of this file when updating it.

## UI and styling

- `src/components/ui/*` is vendored shadcn (`components.json` style `base-nova`) built on
  `@base-ui/react`, not Radix. Use Base UI conventions: `render={<Component />}` instead of
  `asChild`, no `forwardRef`, and `data-slot` attributes. Add primitives with
  `npx shadcn add <component>` rather than hand-writing or pasting Radix versions.
- Import `cn` from `"cn"` (as the UI files do). `@/lib/utils` only re-exports it.
- Tailwind v4 is CSS-first: theme tokens and dark mode live in `src/app/globals.css`; there is
  no `tailwind.config.*`. Reuse existing tokens (`bg-background`, `text-muted-foreground`, etc.).
- Path alias: `@/*` → `src/*`.

## Layout

- `src/app` — App Router entrypoints (`layout.tsx`, `page.tsx`, `globals.css`).
- `src/components/ui` — generated UI primitives; keep close to upstream.
- `src/hooks` — client hooks (`use-mobile`, `use-highlighted-code`).
- `src/lib/highlighter.tsx` — lazy Shiki highlighter with streaming grammar state; register
  new languages in its `languages` map and `aliases`.

## Backend

- This repo is client-only. The sibling `../Framio-server` is an Express + MongoDB API on
  port 5000; no API client or env vars are wired here yet. `.env*` files are gitignored.
