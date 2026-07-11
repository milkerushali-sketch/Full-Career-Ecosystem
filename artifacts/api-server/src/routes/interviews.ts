import { Router } from "express";
import { db } from "@workspace/db";
import { interviewsTable, usersTable, companiesTable, notificationsTable } from "@workspace/db";
import { eq, and, or } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

const formatInterview = (
  i: typeof interviewsTable.$inferSelect,
  studentName: string,
  companyName: string,
) => ({
  ...i,
  studentName,
  companyName,
});

router.get("/interviews", requireAuth, async (req, res): Promise<void> => {
  const user = req.user!;

  const rows = await db
    .select({ interview: interviewsTable, student: usersTable, company: companiesTable })
    .from(interviewsTable)
    .leftJoin(usersTable, eq(interviewsTable.studentId, usersTable.id))
    .leftJoin(companiesTable, eq(interviewsTable.companyId, companiesTable.id))
    .orderBy(interviewsTable.scheduledAt);

  const filtered = user.role === "student"
    ? rows.filter(r => r.interview.studentId === user.userId)
    : rows;

  res.json(filtered.map(r => formatInterview(r.interview, r.student?.name ?? "", r.company?.name ?? "")));
});

router.post("/interviews", requireAuth, requireRole("officer", "admin"), async (req, res): Promise<void> => {
  const { studentId, companyId, jobId, scheduledAt, type, venue } = req.body;
  if (!studentId || !companyId || !scheduledAt || !type) {
    res.status(400).json({ error: "studentId, companyId, scheduledAt and type are required" });
    return;
  }

  const [interview] = await db.insert(interviewsTable).values({
    studentId, companyId, jobId: jobId ?? null, scheduledAt, type, status: "scheduled", venue,
  }).returning();

  const [[student], [company]] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.id, studentId)),
    db.select().from(companiesTable).where(eq(companiesTable.id, companyId)),
  ]);

  // Notify student
  await db.insert(notificationsTable).values({
    userId: studentId,
    title: "Interview Scheduled",
    message: `Your ${type} interview with ${company?.name ?? "a company"} is scheduled for ${scheduledAt}.`,
    type: "interview",
  });

  res.status(201).json(formatInterview(interview, student?.name ?? "", company?.name ?? ""));
});

router.patch("/interviews/:id", requireAuth, requireRole("officer", "admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const [interview] = await db.update(interviewsTable).set(req.body).where(eq(interviewsTable.id, id)).returning();
  if (!interview) { res.status(404).json({ error: "Interview not found" }); return; }

  const [[student], [company]] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.id, interview.studentId)),
    db.select().from(companiesTable).where(eq(companiesTable.id, interview.companyId)),
  ]);

  res.json(formatInterview(interview, student?.name ?? "", company?.name ?? ""));
});

export default router;
