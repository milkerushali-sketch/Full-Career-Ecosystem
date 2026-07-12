# PlacePro

A student career development and placement management system. Students manage
their profile, apply to jobs, and track interviews; placement officers and
admins manage companies, job postings, and the placement pipeline.

This project was built on Replit as a **pnpm monorepo**. This README covers
running it locally in VSCode (or any other editor/terminal).

## Project structure

```
artifacts/
  api-server/          Express API (port 8080)
  placement-system/    React + Vite frontend (port 5173)
  mockup-sandbox/      Component preview sandbox (not needed to run the app)
lib/
  db/                  Drizzle ORM schema, shared by api-server
  api-spec/            OpenAPI spec for the API
  api-zod/             Zod schemas generated from the OpenAPI spec
  api-client-react/    Typed React Query hooks generated from the OpenAPI spec
```
## Directory Structure

```text
.
|-- artifacts/
|   |-- api-server/
|   |   |-- build.mjs
|   |   |-- package.json
|   |   |-- dist/
|   |   `-- src/
|   |       |-- app.ts
|   |       |-- index.ts
|   |       |-- lib/
|   |       `-- routes/
|   |-- mockup-sandbox/
|   |   |-- mockupPreviewPlugin.ts
|   |   |-- package.json
|   |   |-- src/
|   |   `-- vite.config.ts
|   `-- placement-system/
|       |-- package.json
|       |-- public/
|       |-- src/
|       |   |-- components/
|       |   |-- hooks/
|       |   |-- lib/
|       |   `-- pages/
|       `-- vite.config.ts
|-- lib/
|   |-- api-client-react/
|   |-- api-spec/
|   |-- api-zod/
|   `-- db/
|       |-- drizzle.config.ts
|       `-- src/
|           |-- index.ts
|           `-- schema/
|-- scripts/
|   |-- post-merge.sh
|   `-- src/
|-- package.json
|-- pnpm-workspace.yaml
`-- tsconfig.json
```
The frontend and API are two separate services that you run in two separate
terminals; the frontend proxies `/api/*` requests to the API server.

## Prerequisites

- **Node.js 24+** — https://nodejs.org (check with `node -v`)
- **pnpm 10+** — `corepack enable` (bundled with modern Node) or
  `npm install -g pnpm`; check with `pnpm -v`
- **PostgreSQL 14+**, either:
  - installed locally (https://www.postgresql.org/download/), or
  - a free hosted instance (e.g. [Neon](https://neon.tech),
    [Supabase](https://supabase.com), or Docker: `docker run --name placepro-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16`)

Recommended VSCode extensions: **ESLint**, **Prettier**, **Tailwind CSS
IntelliSense**.

## 1. Install dependencies

```bash
git clone <your-repo-url>
cd <repo-folder>
pnpm install
```

This installs dependencies for every package in the monorepo (`artifacts/*`
and `lib/*`) in one step — you do not need to run `pnpm install` inside each
folder.

## 2. Configure environment variables

Copy the example env files and fill them in:

```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
cp artifacts/placement-system/.env.example artifacts/placement-system/.env
```

Edit `artifacts/api-server/.env`:

- `DATABASE_URL` — your Postgres connection string, e.g.
  `postgresql://postgres:postgres@localhost:5432/placepro`
- `SESSION_SECRET` — any long random string (used to sign JWTs). Generate one
  with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

`artifacts/placement-system/.env` already has working defaults for local dev
— no changes needed unless you want different ports.

> These `.env` files are **not** loaded automatically (the project has no
> dotenv dependency). Load them into your shell before running each service —
> the run commands below do this for you with `export $(...)` / `set -a`.
> On Windows, run these commands from **WSL** or **Git Bash**, not
> PowerShell/cmd.

## 3. Set up the database

With `DATABASE_URL` set (see step 2), push the schema and load demo data:

```bash
set -a; source artifacts/api-server/.env; set +a
pnpm --filter @workspace/db run push
npx tsx artifacts/api-server/src/lib/seed.ts
```

The seed script is safe to re-run — it uses `onConflictDoNothing()`. It
creates demo accounts:

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Student | student@placepro.edu   | student@123 |
| Officer | officer@placepro.edu   | officer@123 |
| Admin   | admin@placepro.edu     | admin@123   |

## 4. Run the app

Open **two terminals** in VSCode (`` Ctrl/Cmd+Shift+` ``, then split):

**Terminal 1 — API server:**

```bash
set -a; source artifacts/api-server/.env; set +a
pnpm --filter @workspace/api-server run dev
```

Runs at `http://localhost:8080` (health check: `/api/healthz`).

**Terminal 2 — frontend:**

```bash
set -a; source artifacts/placement-system/.env; set +a
pnpm --filter @workspace/placement-system run dev
```

Runs at `http://localhost:5173`. Open that URL in your browser and sign in
with one of the demo accounts above.

## Other useful commands

```bash
pnpm run typecheck                                        # typecheck everything
pnpm run build                                             # typecheck + build everything
pnpm --filter @workspace/db run push                       # push DB schema changes
pnpm --filter @workspace/api-spec run codegen               # regenerate API hooks/schemas from the OpenAPI spec
```

## Troubleshooting

- **`sh: vite: command not found` / `Cannot find package 'esbuild'`** —
  dependencies aren't installed. Run `pnpm install` from the repo root (not
  inside an `artifacts/*` folder).
- **`relation "users" does not exist"` / login fails with a 500** — the
  database schema hasn't been pushed and/or seeded yet. Run step 3 above.
- **`PORT environment variable is required but was not provided`** — you
  started a service without loading its `.env` file first; re-run the
  `set -a; source ...; set +a` line before the `pnpm --filter ... run dev`
  command.
- **Frontend loads but API calls fail / 404 on `/api/...`** — make sure the
  API server is running and that `API_PROXY_TARGET` in
  `artifacts/placement-system/.env` matches the API server's `PORT`.
- **Login page shows nothing / blank screen** — check both terminal logs for
  errors, and check the browser console.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5, PostgreSQL + Drizzle ORM, Zod validation
- Frontend: React + Vite, Radix UI, TanStack Query
- API client/schemas generated via Orval from an OpenAPI spec (`lib/api-spec`)
