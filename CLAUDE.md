# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server (localhost:3000)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

No test framework is configured.

## Environment

Requires a `.env` file with:
```
DATABASE_URL=postgresql://...   # Neon serverless PostgreSQL connection string
```

## Architecture

**CallPro Entec** is a Next.js 16 event attendance management system with QR code check-in. It uses the App Router, server components for data fetching, and server actions for mutations.

### Two primary interfaces

- `/` — Public check-in form where attendees enter their 6-character code
- `/admin` — Admin dashboard for registering attendees, bulk importing, and viewing stats

### Data flow

1. Pages (`app/page.tsx`, `app/admin/page.tsx`) fetch data server-side via `lib/attendees.ts`
2. Client components (`components/EventCheckIn.tsx`, `components/adminPanel.tsx`) handle UI state
3. User actions trigger server actions in `app/actions/attendees.ts`
4. Server actions mutate PostgreSQL via `lib/attendees.ts`, then call `revalidatePath()`

### Key files

| File | Role |
|------|------|
| `lib/database.ts` | Neon client singleton |
| `lib/attendees.ts` | All DB operations — check-in, registration, bulk import, stats |
| `lib/types.ts` | Shared TypeScript interfaces (`Attendee`, etc.) |
| `lib/helpers.ts` | Code generation (6-char alphanumeric), time formatting, animation helpers |
| `app/actions/attendees.ts` | Server actions called from client components |
| `components/EventCheckIn.tsx` | Main check-in UI with status overlay feedback |
| `components/adminPanel.tsx` | Admin dashboard — attendee table, bulk import dialog, stats |
| `components/atoms/` | `ParticleBG`, `statCard`, `statusOverlay` — reusable display components |
| `components/ui/` | shadcn/ui primitives (button, card, dialog, input, etc.) |

### Database

Table `attendees` is auto-created on first run via `ensureAttendeesTable()`. Schema: `code` (6-char unique), `name`, `email`, `registered_at`, `checked_in` (bool), `checked_in_at`. Indexes on `checked_in` and `registered_at`.

### UI notes

- Styling: Tailwind CSS 4 with shadcn/ui (radix-nova style, CSS variables)
- Some UI strings are in Mongolian (error messages like "Код олдсонгүй" = "Code not found")
- React Compiler is enabled in `next.config.ts` for automatic memoization
- Path alias `@/*` maps to project root
