# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Apihack is a personal, single-user offensive-security training platform: a
ranked mission board (Bronze → Silver → Gold → Platinum → Diamond → Master)
where every mission targets an asset the user actually owns (their GitHub,
their PC, their phone, their home network) or a bundled practice app. There
is no backend, no auth, no multi-user concerns — progress is tracked
client-side in `localStorage` only.

Two independent things live in this repo:

- **The platform itself** (repo root) — an Astro 5 static site.
- **`target-range/`** — a small, *intentionally vulnerable* Bun HTTP server
  used as the guaranteed practice target for the Silver rank's missions. It
  is local-only by design; see `target-range/README.md` before touching it.

## Commands

Run from the repo root unless noted.

```bash
bun install                 # install deps
bun run dev                 # astro dev server at localhost:4321
bun run build                # production build -> ./dist/
bun run preview              # preview the production build
bun run astro check          # typecheck + Astro diagnostics
bun run target-range         # start the intentionally-vulnerable practice server (127.0.0.1:4243)
bun run target-range:seed    # reset target-range's SQLite DB to a clean seed state
```

Prefer starting the dev server in background mode: `astro dev --background`.
Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`. Same
pattern applies to `astro preview`.

There is no test suite yet.

## Architecture

**Content model** — every level and its missions live in one place:
`src/data/levels.json`, validated by the Zod schema in
`src/content.config.ts` (Astro 5 Content Layer API, `file()` loader). To add
or edit a mission, edit `levels.json` directly — the schema will fail the
build if a field is missing or malformed. Each mission carries `objective`,
`difficulty`, `target` (what asset it's run against + whether that resource
is currently available), `tools`, ordered `steps`, `legalBoundaries`,
`risks` (severity + mitigation), `completionCriteria`, and
`writeupPrompts`. `resourceAvailable: false` + `resourceNote` is how a
mission is shipped even when the user doesn't yet have the hardware/lab it
needs (e.g. a monitor-mode Wi-Fi adapter, a hypervisor install).

**Rendering** — `src/pages/index.astro` reads the `levels` collection via
`getCollection("levels")` and hands the plain data to one React island,
`src/components/apihack/LevelBoard.tsx` (`client:load`). Everything
interactive (the mission-card grid, the shadcn `Dialog` mission detail view,
progress checkmarks) lives inside that single component tree —
**don't split shadcn/Radix primitives (`Dialog`, `Tabs`, etc.) across
separate `.astro`-mounted islands**; their state doesn't cross island
boundaries, so `Dialog`/`DialogTrigger`/`DialogContent` etc. must stay
composed together in one hydrated React tree, as they currently are in
`LevelBoard.tsx`.

Progress is read/written only through `src/components/apihack/progress.ts`
(a thin `localStorage` wrapper, key `apihack:progress:v1`) — there is no
server or DB.

**Design tokens** — `src/styles/global.css` defines the whole palette
(dark-only, no light theme) as CSS custom properties consumed via Tailwind
v4's `@theme inline`. This includes two token families beyond shadcn's
usual set: `--risk-*` (severity badges: info/low/medium/high/critical) and
`--rank-*` (bronze/silver/gold/platinum/diamond/master). **Tailwind v4 only
generates utilities for class names that appear literally in source** — a
template-literal like `` `bg-rank-${x}` `` will silently fail to produce
CSS. When a rank/severity color needs to be chosen dynamically, go through
the static lookup maps already in `src/components/apihack/badges.tsx`
(`rankBarClassName`, `rankTextClassName`, etc.) rather than interpolating a
new class name inline.

**`target-range/`** is a separate, dependency-free Bun app (own
`package.json`, invoked via the root `target-range`/`target-range:seed`
scripts). It has one route per intentionally-planted bug (SQL injection in
`src/routes/login.ts`, reflected/stored XSS in `src/routes/search.ts` and
`src/routes/comments.ts`, a forgeable JWT in `src/lib/jwt.ts` trusted by
`src/routes/admin.ts`). Every file that contains a deliberate vulnerability
says so in a header comment, with the intended fix. `data.db` is
gitignored and disposable — reseed anytime with `target-range:seed`. Its
`src/index.ts` binds to `127.0.0.1` only; that is intentional and must not
change.

## Rules of engagement content

The legal/ethics boundaries shown at `/legal` (`src/pages/legal.astro`) are
hardcoded copy, not generated from `levels.json`. If mission-level
`legalBoundaries` text and the `/legal` page ever need to stay in sync on a
policy change, update both by hand.
