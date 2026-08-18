# Apihack

A personal, self-paced offensive-security training range. Every mission
targets something you actually own — your GitHub, your PC, your phone, your
home network — or the intentionally-vulnerable practice app bundled in
`target-range/`. No accounts, no backend, no leaderboard: progress lives in
your browser's `localStorage`.

Six ranks, each a rung on the same ladder: **Bronze** (recon/OSINT) →
**Silver** (web exploitation) → **Gold** (network/Wi-Fi) → **Platinum**
(system/privesc, in disposable VMs) → **Diamond** (mobile) → **Master**
(a red-team capstone you build yourself, then patch and re-attack).

Read `/legal` (Rules of Engagement) before your first mission.

## Stack

Astro 5 (static output) + Tailwind CSS v4 + shadcn/ui, with one React island
for the interactive mission board. Mission/level content is structured,
typed data (`src/data/levels.json`, validated by Zod in
`src/content.config.ts`) — no CMS, no database.

## Commands

```bash
bun install                # install dependencies
bun run dev                 # start the dev server (localhost:4321)
bun run build                # production build -> ./dist/
bun run preview              # preview the production build
bun run target-range         # start the Silver-rank practice server (127.0.0.1:4243, local-only)
bun run target-range:seed    # reset target-range's practice DB
```

## Structure

```
src/
├── content.config.ts        # Zod schema for the "levels" content collection
├── data/levels.json          # every rank + mission, as data
├── components/apihack/       # LevelBoard React island, badges, progress (localStorage)
├── pages/index.astro         # the mission board
├── pages/legal.astro         # Rules of Engagement
└── styles/global.css         # dark-only design tokens (risk + rank color scales)
target-range/                 # intentionally vulnerable practice server — see its own README
```

See `CLAUDE.md` for the full architecture notes.
