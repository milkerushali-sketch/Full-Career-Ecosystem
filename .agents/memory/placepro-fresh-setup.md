---
name: PlacePro fresh-import setup
description: Steps required after importing/cloning the repo before the app actually works
---

**Rule:** After a fresh import or clone, `pnpm install` alone is not enough. The Postgres DB has no tables until `pnpm --filter @workspace/db run push` is run, and no data until the seed script runs. Workflows will start and the login page will render, but every auth/data request 500s until both steps complete.

**Why:** This exact failure occurred on initial setup — workflows failed first due to missing `node_modules` (needed `pnpm install`), then login 500'd with "relation users does not exist" until schema push + seed ran.

**How to apply:** On any fresh setup of this project, run in order: `pnpm install` → `pnpm --filter @workspace/db run push` → `npx tsx artifacts/api-server/src/lib/seed.ts` → restart workflows.
