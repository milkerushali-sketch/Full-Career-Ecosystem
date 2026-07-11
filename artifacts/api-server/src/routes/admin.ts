import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, departmentsTable, companiesTable, jobPostingsTable, interviewsTable, studentProfilesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";
import bcrypt from "bcryptjs";
import { signToken } from "../lib/auth";

const router = Router();

// ── Admin Dashboard ───────────────────────────────────────────────────────────
router.get("/admin/dashboard", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const [[users], [students], [officers], [companies], [departments]] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(usersTable),
    db.select({ count: sql<number>`COUNT(*)` }).from(usersTable).where(eq(usersTable.role, "student")),
    db.select({ count: sql<number>`COUNT(*)` }).from(usersTable).where(eq(usersTable.role, "officer")),
    db.select({ count: sql<number>`COUNT(*)` }).from(companiesTable),
    db.select({ count: sql<number>`COUNT(*)` }).from(departmentsTable),
  ]);

  res.json({
    totalUsers: Number(users?.count ?? 0),
    totalStudents: Number(students?.count ?? 0),
    totalOfficers: Number(officers?.count ?? 0),
    totalCompanies: Number(companies?.count ?? 0),
    totalDepartments: Number(departments?.count ?? 0),
    systemHealth: "healthy",
    recentActivity: [
      "System operating normally",
      "Database connections stable",
      "API response times normal",
    ],
  });
});

// ── User Management ───────────────────────────────────────────────────────────
router.get("/admin/users", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const rows = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(rows.map(u => {
    const { passwordHash: _, ...safe } = u;
    return { ...safe, createdAt: u.createdAt.toISOString() };
  }));
});

router.post("/admin/users", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { name, email, password, role = "student", departmentId } = req.body;
  if (!name || !email || !password) { res.status(400).json({ error: "name, email and password required" }); return; }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({
    name, email: email.toLowerCase().trim(), passwordHash, role, isActive: true, departmentId: departmentId ?? null,
  }).returning();

  if (user.role === "student") {
    await db.insert(studentProfilesTable).values({ userId: user.id }).catch(() => {});
  }

  const { passwordHash: _, ...safe } = user;
  res.status(201).json({ ...safe, createdAt: user.createdAt.toISOString() });
});

router.patch("/admin/users/:id", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const { role, isActive } = req.body;
  const [user] = await db.update(usersTable).set({ role, isActive }).where(eq(usersTable.id, id)).returning();
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  const { passwordHash: _, ...safe } = user;
  res.json({ ...safe, createdAt: user.createdAt.toISOString() });
});

router.delete("/admin/users/:id", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.sendStatus(204);
});

// ── Department Management ─────────────────────────────────────────────────────
router.get("/admin/departments", requireAuth, requireRole("admin", "officer"), async (req, res): Promise<void> => {
  const depts = await db.select().from(departmentsTable).orderBy(departmentsTable.name);
  const studentCounts = await db.select({
    deptId: usersTable.departmentId,
    count: sql<number>`COUNT(*)`,
  }).from(usersTable).where(eq(usersTable.role, "student")).groupBy(usersTable.departmentId);

  const countMap = new Map(studentCounts.map(s => [s.deptId, Number(s.count)]));
  res.json(depts.map(d => ({ ...d, studentCount: countMap.get(d.id) ?? 0 })));
});

router.post("/admin/departments", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { name, code, hodName } = req.body;
  if (!name || !code) { res.status(400).json({ error: "name and code required" }); return; }
  const [dept] = await db.insert(departmentsTable).values({ name, code, hodName }).returning();
  res.status(201).json({ ...dept, studentCount: 0 });
});

router.patch("/admin/departments/:id", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const [dept] = await db.update(departmentsTable).set(req.body).where(eq(departmentsTable.id, id)).returning();
  if (!dept) { res.status(404).json({ error: "Department not found" }); return; }
  res.json({ ...dept, studentCount: 0 });
});

router.delete("/admin/departments/:id", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  await db.delete(departmentsTable).where(eq(departmentsTable.id, id));
  res.sendStatus(204);
});

export default router;
