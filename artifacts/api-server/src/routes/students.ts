import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable, studentProfilesTable, semesterRecordsTable, skillsTable,
  projectsTable, internshipsTable, certificationsTable, codingProfilesTable,
  aiAnalysesTable, companiesTable, notificationsTable, interviewsTable
} from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";
import { computeAIAnalysis } from "../lib/ai";

const router = Router();

// ── GET /students/dashboard ──────────────────────────────────────────────────
router.get("/students/dashboard", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;

  const [[profile], skills, projects, certs, internships, interviews, notifications] = await Promise.all([
    db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, uid)),
    db.select().from(skillsTable).where(eq(skillsTable.userId, uid)),
    db.select().from(projectsTable).where(eq(projectsTable.userId, uid)),
    db.select().from(certificationsTable).where(eq(certificationsTable.userId, uid)),
    db.select().from(internshipsTable).where(eq(internshipsTable.userId, uid)),
    db.select().from(interviewsTable).where(and(eq(interviewsTable.studentId, uid), eq(interviewsTable.status, "scheduled"))),
    db.select().from(notificationsTable).where(and(eq(notificationsTable.userId, uid), eq(notificationsTable.isRead, false))),
  ]);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
  const companies = await db.select().from(companiesTable);
  const eligibleCount = companies.filter(c => {
    const cgpa = parseFloat(profile?.cgpa ?? "0");
    return cgpa >= parseFloat(c.minCGPARequired) && (profile?.backlogs ?? 0) <= c.maxBacklogs;
  }).length;

  const [lastAnalysis] = await db.select().from(aiAnalysesTable).where(eq(aiAnalysesTable.userId, uid))
    .orderBy(sql`${aiAnalysesTable.analysisDate} DESC`).limit(1);

  const profileData = {
    id: profile?.id ?? 0,
    userId: uid,
    name: user?.name ?? "",
    email: user?.email ?? "",
    rollNo: profile?.rollNo ?? null,
    phone: profile?.phone ?? null,
    department: null as string | null,
    batch: profile?.batch ?? null,
    cgpa: profile?.cgpa ? parseFloat(profile.cgpa) : null,
    backlogs: profile?.backlogs ?? 0,
    address: profile?.address ?? null,
    bio: profile?.bio ?? null,
    linkedinUrl: profile?.linkedinUrl ?? null,
    resumeUrl: profile?.resumeUrl ?? null,
    photoUrl: profile?.photoUrl ?? null,
  };

  res.json({
    profile: profileData,
    readinessScore: lastAnalysis ? parseFloat(lastAnalysis.readinessScore) : 0,
    skillCount: skills.length,
    projectCount: projects.length,
    certificationCount: certs.length,
    internshipCount: internships.length,
    upcomingInterviews: interviews.length,
    recentNotifications: notifications.length,
    eligibleCompanyCount: eligibleCount,
  });
});

// ── GET /students/profile ────────────────────────────────────────────────────
router.get("/students/profile", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const [[user], [profile]] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.id, uid)),
    db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, uid)),
  ]);

  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  res.json({
    id: profile?.id ?? 0,
    userId: uid,
    name: user.name,
    email: user.email,
    rollNo: profile?.rollNo ?? null,
    phone: profile?.phone ?? null,
    department: null,
    batch: profile?.batch ?? null,
    cgpa: profile?.cgpa ? parseFloat(profile.cgpa) : null,
    backlogs: profile?.backlogs ?? 0,
    address: profile?.address ?? null,
    bio: profile?.bio ?? null,
    linkedinUrl: profile?.linkedinUrl ?? null,
    resumeUrl: profile?.resumeUrl ?? null,
    photoUrl: profile?.photoUrl ?? null,
  });
});

// ── PUT /students/profile ────────────────────────────────────────────────────
router.put("/students/profile", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const { phone, address, bio, linkedinUrl, photoUrl } = req.body;

  const [existing] = await db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, uid));
  let profile;
  if (existing) {
    [profile] = await db.update(studentProfilesTable)
      .set({ phone, address, bio, linkedinUrl, photoUrl })
      .where(eq(studentProfilesTable.userId, uid)).returning();
  } else {
    [profile] = await db.insert(studentProfilesTable)
      .values({ userId: uid, phone, address, bio, linkedinUrl, photoUrl }).returning();
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
  res.json({
    id: profile.id, userId: uid,
    name: user.name, email: user.email,
    rollNo: profile.rollNo ?? null,
    phone: profile.phone ?? null,
    department: null,
    batch: profile.batch ?? null,
    cgpa: profile.cgpa ? parseFloat(profile.cgpa) : null,
    backlogs: profile.backlogs ?? 0,
    address: profile.address ?? null,
    bio: profile.bio ?? null,
    linkedinUrl: profile.linkedinUrl ?? null,
    resumeUrl: profile.resumeUrl ?? null,
    photoUrl: profile.photoUrl ?? null,
  });
});

// ── GET /students/academics ──────────────────────────────────────────────────
router.get("/students/academics", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const [[profile], semesters] = await Promise.all([
    db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, uid)),
    db.select().from(semesterRecordsTable).where(eq(semesterRecordsTable.userId, uid))
      .orderBy(semesterRecordsTable.semester),
  ]);
  res.json({
    cgpa: profile?.cgpa ? parseFloat(profile.cgpa) : 0,
    backlogs: profile?.backlogs ?? 0,
    semesters: semesters.map(s => ({
      id: s.id, semester: s.semester,
      sgpa: parseFloat(s.sgpa), year: s.year, backlogs: s.backlogs,
    })),
  });
});

// ── PUT /students/academics ──────────────────────────────────────────────────
router.put("/students/academics", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const { cgpa, backlogs, semesters } = req.body;

  const [existing] = await db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, uid));
  if (existing) {
    await db.update(studentProfilesTable).set({ cgpa: String(cgpa), backlogs }).where(eq(studentProfilesTable.userId, uid));
  } else {
    await db.insert(studentProfilesTable).values({ userId: uid, cgpa: String(cgpa), backlogs });
  }

  if (Array.isArray(semesters) && semesters.length > 0) {
    await db.delete(semesterRecordsTable).where(eq(semesterRecordsTable.userId, uid));
    await db.insert(semesterRecordsTable).values(
      semesters.map((s: { semester: number; sgpa: number; year: string; backlogs?: number }) => ({
        userId: uid, semester: s.semester, sgpa: String(s.sgpa), year: s.year, backlogs: s.backlogs ?? 0,
      }))
    );
  }

  const allSemesters = await db.select().from(semesterRecordsTable).where(eq(semesterRecordsTable.userId, uid)).orderBy(semesterRecordsTable.semester);
  res.json({
    cgpa: cgpa ?? 0,
    backlogs: backlogs ?? 0,
    semesters: allSemesters.map(s => ({ id: s.id, semester: s.semester, sgpa: parseFloat(s.sgpa), year: s.year, backlogs: s.backlogs })),
  });
});

// ── Skills ───────────────────────────────────────────────────────────────────
router.get("/students/skills", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const skills = await db.select().from(skillsTable).where(eq(skillsTable.userId, req.user!.userId));
  res.json(skills);
});

router.post("/students/skills", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const { name, level, category } = req.body;
  if (!name || !level || !category) { res.status(400).json({ error: "name, level and category are required" }); return; }
  const [skill] = await db.insert(skillsTable).values({ userId: req.user!.userId, name, level, category }).returning();
  res.status(201).json(skill);
});

router.delete("/students/skills/:id", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  await db.delete(skillsTable).where(and(eq(skillsTable.id, id), eq(skillsTable.userId, req.user!.userId)));
  res.sendStatus(204);
});

// ── Projects ─────────────────────────────────────────────────────────────────
router.get("/students/projects", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const projects = await db.select().from(projectsTable).where(eq(projectsTable.userId, req.user!.userId));
  res.json(projects.map(p => ({ ...p, techStack: p.techStack ?? [] })));
});

router.post("/students/projects", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const { title, description, techStack, githubUrl, liveUrl, startDate, endDate } = req.body;
  if (!title) { res.status(400).json({ error: "title is required" }); return; }
  const [project] = await db.insert(projectsTable).values({
    userId: req.user!.userId, title, description, techStack: techStack ?? [], githubUrl, liveUrl, startDate, endDate,
  }).returning();
  res.status(201).json({ ...project, techStack: project.techStack ?? [] });
});

router.patch("/students/projects/:id", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const [project] = await db.update(projectsTable).set(req.body)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, req.user!.userId))).returning();
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...project, techStack: project.techStack ?? [] });
});

router.delete("/students/projects/:id", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  await db.delete(projectsTable).where(and(eq(projectsTable.id, id), eq(projectsTable.userId, req.user!.userId)));
  res.sendStatus(204);
});

// ── Internships ──────────────────────────────────────────────────────────────
router.get("/students/internships", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const rows = await db.select().from(internshipsTable).where(eq(internshipsTable.userId, req.user!.userId));
  res.json(rows.map(i => ({ ...i, stipend: i.stipend ? parseFloat(i.stipend) : null })));
});

router.post("/students/internships", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const { company, role, description, startDate, endDate, stipend, location } = req.body;
  if (!company || !role) { res.status(400).json({ error: "company and role are required" }); return; }
  const [intern] = await db.insert(internshipsTable).values({
    userId: req.user!.userId, company, role, description, startDate, endDate,
    stipend: stipend != null ? String(stipend) : null, location,
  }).returning();
  res.status(201).json({ ...intern, stipend: intern.stipend ? parseFloat(intern.stipend) : null });
});

router.patch("/students/internships/:id", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const body = { ...req.body, stipend: req.body.stipend != null ? String(req.body.stipend) : undefined };
  const [intern] = await db.update(internshipsTable).set(body)
    .where(and(eq(internshipsTable.id, id), eq(internshipsTable.userId, req.user!.userId))).returning();
  if (!intern) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...intern, stipend: intern.stipend ? parseFloat(intern.stipend) : null });
});

router.delete("/students/internships/:id", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  await db.delete(internshipsTable).where(and(eq(internshipsTable.id, id), eq(internshipsTable.userId, req.user!.userId)));
  res.sendStatus(204);
});

// ── Certifications ───────────────────────────────────────────────────────────
router.get("/students/certifications", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  res.json(await db.select().from(certificationsTable).where(eq(certificationsTable.userId, req.user!.userId)));
});

router.post("/students/certifications", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const { name, issuer, issueDate, expiryDate, credentialUrl, credentialId } = req.body;
  if (!name || !issuer) { res.status(400).json({ error: "name and issuer are required" }); return; }
  const [cert] = await db.insert(certificationsTable).values({
    userId: req.user!.userId, name, issuer, issueDate, expiryDate, credentialUrl, credentialId,
  }).returning();
  res.status(201).json(cert);
});

router.delete("/students/certifications/:id", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  await db.delete(certificationsTable).where(and(eq(certificationsTable.id, id), eq(certificationsTable.userId, req.user!.userId)));
  res.sendStatus(204);
});

// ── Coding Profiles ──────────────────────────────────────────────────────────
router.get("/students/coding-profiles", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const [row] = await db.select().from(codingProfilesTable).where(eq(codingProfilesTable.userId, req.user!.userId));
  res.json(row ?? {});
});

router.put("/students/coding-profiles", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const [existing] = await db.select().from(codingProfilesTable).where(eq(codingProfilesTable.userId, uid));
  let row;
  if (existing) {
    [row] = await db.update(codingProfilesTable).set(req.body).where(eq(codingProfilesTable.userId, uid)).returning();
  } else {
    [row] = await db.insert(codingProfilesTable).values({ userId: uid, ...req.body }).returning();
  }
  res.json(row);
});

// ── AI Analysis ──────────────────────────────────────────────────────────────
router.get("/students/ai-analysis", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const [analysis] = await db.select().from(aiAnalysesTable).where(eq(aiAnalysesTable.userId, uid))
    .orderBy(sql`${aiAnalysesTable.analysisDate} DESC`).limit(1);

  if (!analysis) {
    // Auto-generate on first request
    return runAnalysis(uid, res);
  }

  res.json({
    readinessScore: parseFloat(analysis.readinessScore),
    resumeScore: parseFloat(analysis.resumeScore),
    skillGaps: analysis.skillGaps as unknown[],
    recommendations: analysis.recommendations as unknown[],
    strengths: analysis.strengths ?? [],
    weaknesses: analysis.weaknesses ?? [],
    analysisDate: analysis.analysisDate?.toISOString(),
  });
});

router.post("/students/ai-analysis", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  await runAnalysis(req.user!.userId, res);
});

async function runAnalysis(uid: number, res: any): Promise<void> {
  const [[profile], skills, projects, certs, internships, [coding]] = await Promise.all([
    db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, uid)),
    db.select().from(skillsTable).where(eq(skillsTable.userId, uid)),
    db.select().from(projectsTable).where(eq(projectsTable.userId, uid)),
    db.select().from(certificationsTable).where(eq(certificationsTable.userId, uid)),
    db.select().from(internshipsTable).where(eq(internshipsTable.userId, uid)),
    db.select().from(codingProfilesTable).where(eq(codingProfilesTable.userId, uid)),
  ]);

  const result = computeAIAnalysis({
    cgpa: profile?.cgpa ? parseFloat(profile.cgpa) : 0,
    backlogs: profile?.backlogs ?? 0,
    skills,
    projectCount: projects.length,
    certCount: certs.length,
    internCount: internships.length,
    codingProfile: coding ?? null,
    hasResume: !!profile?.resumeUrl || !!profile?.resumeText,
  });

  await db.insert(aiAnalysesTable).values({
    userId: uid,
    readinessScore: String(result.readinessScore),
    resumeScore: String(result.resumeScore),
    skillGaps: result.skillGaps,
    recommendations: result.recommendations,
    strengths: result.strengths,
    weaknesses: result.weaknesses,
  });

  res.json(result);
}

// ── Company Eligibility ──────────────────────────────────────────────────────
router.get("/students/eligibility", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const [[profile], skills, companies] = await Promise.all([
    db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, uid)),
    db.select().from(skillsTable).where(eq(skillsTable.userId, uid)),
    db.select().from(companiesTable),
  ]);

  const cgpa = profile?.cgpa ? parseFloat(profile.cgpa) : 0;
  const backlogs = profile?.backlogs ?? 0;
  const skillNames = skills.map(s => s.name.toLowerCase());

  const result = companies.map(c => {
    const reasons: string[] = [];
    const missing: string[] = [];
    const eligible = cgpa >= parseFloat(c.minCGPARequired) && backlogs <= c.maxBacklogs;

    if (cgpa >= parseFloat(c.minCGPARequired)) reasons.push(`CGPA ${cgpa} meets minimum ${c.minCGPARequired}`);
    else missing.push(`CGPA below ${c.minCGPARequired} (yours: ${cgpa})`);

    if (backlogs <= c.maxBacklogs) reasons.push("Backlog count within limit");
    else missing.push(`${backlogs} backlogs exceed limit of ${c.maxBacklogs}`);

    const reqSkills = c.requiredSkills ?? [];
    const matchedSkills = reqSkills.filter(rs => skillNames.some(sn => sn.includes(rs.toLowerCase())));
    const missingSkills = reqSkills.filter(rs => !skillNames.some(sn => sn.includes(rs.toLowerCase())));
    if (matchedSkills.length > 0) reasons.push(`Skills matched: ${matchedSkills.join(", ")}`);
    missingSkills.forEach(ms => missing.push(`Missing skill: ${ms}`));

    const matchScore = Math.round((reasons.length / Math.max(reasons.length + missing.length, 1)) * 100);

    return {
      company: {
        ...c,
        minCGPA: c.minCGPARequired ? parseFloat(c.minCGPARequired) : null,
        minCGPARequired: parseFloat(c.minCGPARequired),
        packageMin: c.packageMin ? parseFloat(c.packageMin) : null,
        packageMax: c.packageMax ? parseFloat(c.packageMax) : null,
        requiredSkills: c.requiredSkills ?? [],
        eligibleDepartments: c.eligibleDepartments ?? [],
      },
      eligible,
      matchScore,
      reasons,
      missingCriteria: missing,
    };
  });

  res.json(result.sort((a, b) => b.matchScore - a.matchScore));
});

export default router;
