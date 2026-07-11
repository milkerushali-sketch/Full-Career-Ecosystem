import { Router } from "express";
import { db } from "@workspace/db";
import { jobPostingsTable, jobApplicationsTable, companiesTable, notificationsTable, usersTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

router.get("/jobs", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select({
      job: jobPostingsTable,
      companyName: companiesTable.name,
      applicationCount: sql<number>`(SELECT COUNT(*) FROM job_applications WHERE job_id = ${jobPostingsTable.id})`,
    })
    .from(jobPostingsTable)
    .leftJoin(companiesTable, eq(jobPostingsTable.companyId, companiesTable.id))
    .orderBy(sql`${jobPostingsTable.createdAt} DESC`);

  res.json(rows.map(r => ({
    ...r.job,
    companyName: r.companyName ?? "",
    applicationCount: Number(r.applicationCount),
    ctc: r.job.ctc ? parseFloat(r.job.ctc) : null,
  })));
});

router.post("/jobs", requireAuth, requireRole("officer", "admin"), async (req, res): Promise<void> => {
  const { title, companyId, description, eligibilityCriteria, applicationDeadline, status, ctc, openings } = req.body;
  if (!title || !companyId) { res.status(400).json({ error: "title and companyId are required" }); return; }

  const [job] = await db.insert(jobPostingsTable).values({
    title, companyId, description, eligibilityCriteria, applicationDeadline,
    status: status ?? "open",
    ctc: ctc != null ? String(ctc) : null,
    openings,
  }).returning();

  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, companyId));

  // Notify all students
  const students = await db.select().from(usersTable).where(eq(usersTable.role, "student"));
  if (students.length > 0) {
    await db.insert(notificationsTable).values(
      students.map(s => ({
        userId: s.id,
        title: "New Job Opportunity",
        message: `${company?.name ?? "A company"} is hiring for ${title}. Apply before ${applicationDeadline ?? "deadline"}.`,
        type: "job" as const,
      }))
    );
  }

  res.status(201).json({ ...job, companyName: company?.name ?? "", applicationCount: 0, ctc: job.ctc ? parseFloat(job.ctc) : null });
});

router.patch("/jobs/:id", requireAuth, requireRole("officer", "admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const body = { ...req.body, ctc: req.body.ctc != null ? String(req.body.ctc) : undefined };
  const [job] = await db.update(jobPostingsTable).set(body).where(eq(jobPostingsTable.id, id)).returning();
  if (!job) { res.status(404).json({ error: "Job not found" }); return; }
  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, job.companyId));
  const [cnt] = await db.select({ count: sql<number>`COUNT(*)` }).from(jobApplicationsTable).where(eq(jobApplicationsTable.jobId, id));
  res.json({ ...job, companyName: company?.name ?? "", applicationCount: Number(cnt?.count ?? 0), ctc: job.ctc ? parseFloat(job.ctc) : null });
});

router.delete("/jobs/:id", requireAuth, requireRole("officer", "admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  await db.delete(jobPostingsTable).where(eq(jobPostingsTable.id, id));
  res.sendStatus(204);
});

router.post("/jobs/:id/apply", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const jobId = parseInt(req.params.id as string);
  const studentId = req.user!.userId;

  const [existing] = await db.select().from(jobApplicationsTable)
    .where(and(eq(jobApplicationsTable.jobId, jobId), eq(jobApplicationsTable.studentId, studentId)));
  if (existing) { res.status(400).json({ error: "Already applied" }); return; }

  const [app] = await db.insert(jobApplicationsTable).values({ jobId, studentId, status: "applied" }).returning();
  res.status(201).json({ ...app, appliedAt: app.appliedAt.toISOString() });
});

export default router;
