# FocusQuest — replit.md

## Overview

FocusQuest is a fantasy-themed focus/productivity app built as a mobile-first web application. Users create an RPG-style character, choose up to 3 disciplines from 8 options, and earn XP by completing real-world timed focus sessions. The app features a Moonlight + Gold dark design system with a rich atmospheric UI.

**Core features:**
- Multi-step onboarding flow: splash → philosophy → identity → avatar → discipline selection → quest summary
- Discipline system: 8 disciplines (scholar, warrior, scribe, adventurer, ranger, alchemist, bard, monk) — user picks 1–3 during onboarding; multi-select with max 3 enforced
- Focus session timer with pause/resume, optional target duration, and XP rewards
- Disciplines tab showing per-discipline level progression with glyph, XP bar, and total time
- Session history with stats (streak, total focus time, monthly sessions) and calendar heatmap
- Profile page with all selected discipline badges, overall level, and stats

The app is designed to fit a 430px-wide mobile viewport. It is a dark-only app — no light mode.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Frontend

- **Framework:** React (no SSR) with TypeScript, bundled via Vite
- **Routing:** `wouter` — lightweight client-side routing
- **State management:** Custom `FQContext` (React Context + `useState`) — all app state (character, skills, sessions, active session) lives here and is persisted to `localStorage` via `loadState`/`saveState` helpers in `fq-data.ts`
- **Server data fetching:** TanStack React Query (`@tanstack/react-query`) — configured for no automatic refetching, infinity stale time; used for any future API calls
- **UI components:** shadcn/ui component library (Radix UI primitives + Tailwind CSS), "new-york" style
- **Styling:** Tailwind CSS with CSS custom properties for the Moonlight design system. Fonts: `EB Garamond` (body/serif), `Cinzel` (display/headings), loaded from Google Fonts. Dark theme is the only theme.
- **Icons:** Lucide React

### Page Structure

| Route | Component | Purpose |
|---|---|---|
| `/` or `/home` | `Home` | Dashboard — skill list, start session sheet |
| `/session` | `Session` | Active focus timer with SVG ring and pause/resume |
| `/skills` | `Skills` | Browse/manage skills by category |
| `/history` | `History` | Session log and stats |
| `/profile` | `Profile` | Character info, skill progress, reset |
| Onboarding | `Onboarding` | Multi-step wizard shown before app is accessible |

Navigation is a fixed bottom tab bar hidden during active sessions and onboarding.

### Backend

- **Runtime:** Node.js with Express (v5)
- **Server entry:** `server/index.ts` — creates HTTP server, mounts routes, serves Vite middleware in dev or static files in production
- **Routes:** `server/routes.ts` — currently empty scaffold; all API routes should be prefixed `/api`
- **Storage interface:** `server/storage.ts` — defines `IStorage` interface with `getUser`, `getUserByUsername`, `createUser`; currently implemented as in-memory `MemStorage` (a `Map`)
- **Build:** Custom script (`script/build.ts`) — runs Vite for client, then esbuild to bundle server into `dist/index.cjs`, bundling selected deps for faster cold starts

### Database

- **ORM:** Drizzle ORM with PostgreSQL dialect
- **Schema:** `shared/schema.ts` — currently defines a `users` table (id, username, password). Zod schemas are auto-generated via `drizzle-zod`.
- **Config:** `drizzle.config.ts` reads `DATABASE_URL` from environment
- **Migrations:** Output to `./migrations`, run via `drizzle-kit push`
- **Note:** The current storage layer uses in-memory storage. To wire up Postgres, replace `MemStorage` with a Drizzle-backed implementation using the existing schema.

### Data Flow

1. All user/game data (character, skills, sessions) is currently stored **client-side in localStorage** via `fq-context.tsx` / `fq-data.ts`. The backend user model exists but is not yet connected to the frontend.
2. The shared `schema.ts` is available to both server and client via the `@shared/*` path alias.
3. The `queryClient` in `lib/queryClient.ts` includes a generic `apiRequest` helper for making authenticated API calls when backend routes are added.

---

## External Dependencies

### UI / Component Libraries
- **shadcn/ui** — component scaffolding (Radix UI primitives)
- **Radix UI** — full suite of accessible headless components (accordion, dialog, dropdown, select, tabs, etc.)
- **Lucide React** — icon library
- **Embla Carousel** — carousel/swipe component
- **Vaul** — drawer primitive
- **cmdk** — command palette component
- **Recharts** — charting (chart.tsx scaffold present)
- **react-day-picker** — calendar component

### Forms & Validation
- **React Hook Form** + **@hookform/resolvers**
- **Zod** + **drizzle-zod** for schema-derived validation

### Database & ORM
- **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`) — PostgreSQL dialect
- **`pg`** — PostgreSQL client
- **`connect-pg-simple`** — Postgres-backed session store (available for use)

### Session / Auth
- **`express-session`** — server-side session middleware (included as dependency)
- **`passport`** + **`passport-local`** — authentication (included, not yet wired up)
- **`jsonwebtoken`** — JWT support available

### Fonts
- **Google Fonts** — EB Garamond, Cinzel (loaded via `<link>` in `index.html`)

### Replit-specific
- **`@replit/vite-plugin-runtime-error-modal`** — dev error overlay
- **`@replit/vite-plugin-cartographer`** — dev tooling (loaded conditionally in dev on Replit)
- **`@replit/vite-plugin-dev-banner`** — dev banner (same condition)

### Utilities
- **`date-fns`** — date formatting
- **`nanoid`** — ID generation
- **`clsx`** + **`tailwind-merge`** — className utilities