---
name: PlacePro DB rebuild pattern
description: How to regenerate lib/db dist declarations after schema changes
---

**Rule:** After adding new tables to lib/db/src/schema/, run `tsc -p lib/db/tsconfig.json` (from workspace root: `cd lib/db && npx tsc -p tsconfig.json`) to rebuild dist/*.d.ts before running typecheck on packages that reference @workspace/db.

**Why:** The api-server uses TypeScript project references (`"references": [{"path": "../../lib/db"}]`). TypeScript resolves @workspace/db through the generated dist/schema/*.d.ts files, not the source. Without rebuilding, new tables show "Module has no exported member" errors even though they exist in src/.

**How to apply:** Any time a new .ts file is added to lib/db/src/schema/ or lib/db/src/schema/index.ts is updated, run the tsc rebuild before running api-server typecheck or build. There is no "build" script in lib/db/package.json — use `tsc -p tsconfig.json` directly.
