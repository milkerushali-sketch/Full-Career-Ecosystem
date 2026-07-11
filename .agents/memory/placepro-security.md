---
name: PlacePro security model
description: Auth and authorization rules enforced in the placement system backend
---

**Rules:**
1. `POST /api/auth/register` is public and always creates accounts with `role = "student"`. The `role` field in the request body is ignored. Only admins can create officer/admin accounts via `POST /api/admin/users`.
2. `PATCH /api/interviews/:id` requires `requireRole("officer", "admin")`. Students must not modify interview records.
3. JWT_SECRET is read from `SESSION_SECRET` env var at startup. The server throws if this is missing — there is no hardcoded fallback.

**Why:** Code review flagged privilege escalation (clients self-assigning officer/admin roles), broken interview authz, and a hardcoded JWT fallback secret as critical security issues.

**How to apply:** Whenever adding new POST routes for resource creation, check if the route is public. Public routes must not accept a role parameter that grants elevated access. Sensitive mutation routes (interviews, job applications, user management) must gate on the minimum required role.
