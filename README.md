# PlacePro

A student career development and placement management system. Students manage
their profile, apply to jobs, and track interviews; placement officers and
admins manage companies, job postings, and the placement pipeline.

This project is a **pnpm monorepo**. It contains the PlacePro frontend, API,
database schema, and generated API contracts. The instructions below cover
running it locally in VSCode on Windows, macOS, or Linux.

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

The frontend proxies `/api/*` requests to the API server. The root `dev`
command starts both services together.

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
git clone https://github.com/milkerushali-sketch/Full-Career-Ecosystem.git
cd Full-Career-Ecosystem
pnpm install
```

This installs dependencies for every package in the monorepo (`artifacts/*`
and `lib/*`) in one step — you do not need to run `pnpm install` inside each
folder.

## 2. Configure environment variables

Copy the API example env file and fill in your local PostgreSQL credentials:

```powershell
Copy-Item artifacts/api-server/.env.example artifacts/api-server/.env
```

Edit `artifacts/api-server/.env`:

- `DATABASE_URL` — your Postgres connection string, e.g.
  `postgresql://postgres:postgres@localhost:5432/placepro`
- `SESSION_SECRET` — any long random string (used to sign JWTs). Generate one
  with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

The frontend has working local defaults and does not require an `.env` file.
To override them, create `artifacts/placement-system/.env` from its example.

The root `pnpm run dev` command loads both `.env` files automatically. Never
commit a real `.env` file; only the `.env.example` files belong in Git.

## 3. Set up the database

With `DATABASE_URL` set in `artifacts/api-server/.env`, push the schema and
load demo data:

```powershell
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server exec tsx src/lib/seed.ts
```

The seed script is safe to re-run — it uses `onConflictDoNothing()`. It
creates demo accounts:

| Role    | Email                | Password    |
| ------- | -------------------- | ----------- |
| Student | student@placepro.edu | student@123 |
| Officer | officer@placepro.edu | officer@123 |
| Admin   | admin@placepro.edu   | admin@123   |

## 4. Run the app

Once `artifacts/api-server/.env` contains a valid `DATABASE_URL` and
`SESSION_SECRET`, start the complete application with one command from the
repository root:

```powershell
pnpm run dev
```

The command starts the API on `http://localhost:8080` and the frontend on
`http://localhost:5173`. Press `Ctrl+C` to stop services started by the
command. If either port is already in use by a running instance, the launcher
reuses that service instead of starting a duplicate process.

If the environment file is not configured yet, the command prints the missing
variable and exits without starting an incomplete app.

### Manual startup

If you need to run services separately, use two terminals. On PowerShell, set
the environment variables before each command:

**Terminal 1 — API server:**

```powershell
$env:DATABASE_URL = (Get-Content artifacts/api-server/.env | Where-Object { $_ -match '^DATABASE_URL=' }).Split('=', 2)[1].Trim('"')
$env:SESSION_SECRET = (Get-Content artifacts/api-server/.env | Where-Object { $_ -match '^SESSION_SECRET=' }).Split('=', 2)[1].Trim('"')
$env:PORT = "8080"
pnpm --filter @workspace/api-server run dev
```

Runs at `http://localhost:8080` (health check: `/api/healthz`).

**Terminal 2 — frontend:**

```powershell
$env:PORT = "5173"
$env:BASE_PATH = "/"
$env:API_PROXY_TARGET = "http://localhost:8080"
pnpm --filter @workspace/placement-system run dev
```

Runs at `http://localhost:5173`. Open that URL in your browser and sign in
with one of the demo accounts above.

## Other useful commands

```bash
pnpm run typecheck                                        # typecheck everything
pnpm run build                                             # typecheck + build everything
pnpm run dev                                               # start API and frontend together
pnpm --filter @workspace/db run push                       # push DB schema changes
pnpm --filter @workspace/api-spec run codegen               # regenerate API hooks/schemas from the OpenAPI spec
```

## Troubleshooting

- **`sh: vite: command not found` / `Cannot find package 'esbuild'`** —
  dependencies aren't installed. Run `pnpm install` from the repo root (not
  inside an `artifacts/*` folder).
- **`relation "users" does not exist"` / login fails with a 500** — the
  database schema hasn't been pushed and/or seeded yet. Run step 3 above.
- **`EADDRINUSE` / port already in use** — another instance is already
  running. Use `pnpm run dev`; it reuses services already listening on ports
  5173 and 8080. To find a process on Windows, run
  `Get-NetTCPConnection -LocalPort 5173,8080 -State Listen`.
- **`spawn EINVAL` on Windows** — use the root `pnpm run dev` command. The
  launcher handles Windows `pnpm.cmd` execution automatically.
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
