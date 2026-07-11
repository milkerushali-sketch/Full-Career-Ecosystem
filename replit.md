# PlacePro

A student career development and placement management system: students manage profiles, applications, and interviews; placement officers and admins manage companies, job postings, and the placement pipeline.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied via `/api`)
- `pnpm --filter @workspace/placement-system run dev` — run the web frontend (proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `npx tsx artifacts/api-server/src/lib/seed.ts` — seed demo data (departments, companies, jobs, demo users); safe to re-run
- Required env: `DATABASE_URL` (Postgres), `SESSION_SECRET` (JWT signing secret, no fallback)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite, Radix UI

## Where things live

- `artifacts/api-server` — Express API (routes, auth, seed script)
- `artifacts/placement-system` — React/Vite frontend
- `lib/db` — Drizzle schema (`src/schema/`) shared via `@workspace/db`; run `tsc -p tsconfig.json` after schema changes to rebuild `dist/*.d.ts` before other packages typecheck against it

## Architecture decisions

- JWT secret is read from `SESSION_SECRET` at startup with no hardcoded fallback — server throws if missing.
- Public registration (`POST /api/auth/register`) always creates `role = "student"` accounts; the `role` field in the request body is ignored. Officer/admin accounts can only be created by an admin via `POST /api/admin/users`.
- `PATCH /api/interviews/:id` requires officer/admin role — students cannot modify interview records.

## Product

- Students: manage profile (skills, projects, internships, certifications, coding profiles), browse job postings, apply, track interviews and notifications.
- Officers/Admins: manage departments, companies, job postings, review applications, schedule/update interviews; admins can also create officer/admin accounts.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After importing/cloning, run `pnpm install`, then `pnpm --filter @workspace/db run push` and the seed script above — the database starts empty.
- Demo login credentials: `student@placepro.edu` / `student@123`, `officer@placepro.edu` / `officer@123`, `admin@placepro.edu` / `admin@123` (see seed script for more demo students).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
