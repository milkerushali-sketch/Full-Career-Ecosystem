---
name: PlacePro seed credentials
description: Demo account credentials and how to re-seed
---

**Demo credentials (seeded via artifacts/api-server/src/lib/seed.ts):**
- Admin:   admin@placepro.edu   / admin@123
- Officer: officer@placepro.edu / officer@123
- Student: student@placepro.edu / student@123 (Arjun Mehta, CGPA 8.2, full profile)
- Extra demo students: priya@placepro.edu, rahul@placepro.edu, sneha@placepro.edu, kiran@placepro.edu / demo@123

**Re-seeding:** Run `npx tsx artifacts/api-server/src/lib/seed.ts` from workspace root. Uses `onConflictDoNothing()` so safe to re-run. Seeded data includes 5 departments, 6 companies, 4 job postings, complete student profile with 8 skills, 3 projects, 2 internships, 2 certifications, coding profiles, and notifications.
