// Standalone "AI Resume" feature module — kept separate from students.ts so it
// can be understood, tested, and modified independently of the rest of the
// student routes. Two capabilities:
//   1. POST /students/resume/build   — generate an ATS-friendly resume from profile data
//   2. POST /students/resume/upload  — upload a resume PDF, extract its text, and score
//                                       it against a target company's requirements
import { Router } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import {
  usersTable, studentProfilesTable, semesterRecordsTable, skillsTable,
  projectsTable, internshipsTable, certificationsTable, codingProfilesTable,
  companiesTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";
import { buildResume } from "../lib/resumeBuilder";
import { extractTextFromPdf } from "../lib/pdfText";
import { analyzeResumeUpload } from "../lib/resumeMatch";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") { cb(new Error("Only PDF files are supported")); return; }
    cb(null, true);
  },
});

async function loadFullProfile(uid: number) {
  const [[user], [profile], skills, projects, internships, certifications, semesters, [coding]] = await Promise.all([
    db.select().from(usersTable).where(eq(usersTable.id, uid)),
    db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, uid)),
    db.select().from(skillsTable).where(eq(skillsTable.userId, uid)),
    db.select().from(projectsTable).where(eq(projectsTable.userId, uid)),
    db.select().from(internshipsTable).where(eq(internshipsTable.userId, uid)),
    db.select().from(certificationsTable).where(eq(certificationsTable.userId, uid)),
    db.select().from(semesterRecordsTable).where(eq(semesterRecordsTable.userId, uid)),
    db.select().from(codingProfilesTable).where(eq(codingProfilesTable.userId, uid)),
  ]);
  return { user, profile, skills, projects, internships, certifications, semesters, coding };
}

// ── POST /students/resume/build ──────────────────────────────────────────────
router.post("/students/resume/build", requireAuth, requireRole("student"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const { user, profile, skills, projects, internships, certifications, semesters, coding } = await loadFullProfile(uid);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  const resume = buildResume({
    name: user.name,
    email: user.email,
    phone: profile?.phone,
    address: profile?.address,
    linkedinUrl: profile?.linkedinUrl,
    bio: profile?.bio,
    rollNo: profile?.rollNo,
    batch: profile?.batch,
    cgpa: profile?.cgpa ? parseFloat(profile.cgpa) : null,
    backlogs: profile?.backlogs ?? 0,
    skills,
    projects,
    internships,
    certifications,
    semesters: semesters.map(s => ({ semester: s.semester, sgpa: parseFloat(s.sgpa), year: s.year })),
    codingProfile: coding ?? null,
  });

  res.json(resume);
});

// ── POST /students/resume/upload ─────────────────────────────────────────────
router.post("/students/resume/upload", requireAuth, requireRole("student"), upload.single("file"), async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  if (!req.file) { res.status(400).json({ error: "A PDF file is required (field name: file)" }); return; }

  let resumeText: string;
  try {
    resumeText = await extractTextFromPdf(req.file.buffer);
  } catch {
    res.status(400).json({ error: "Could not read this PDF. Make sure it's a valid, text-based PDF (not a scanned image)." });
    return;
  }
  if (!resumeText || resumeText.length < 20) {
    res.status(400).json({ error: "No readable text found in this PDF. Scanned/image-only resumes cannot be parsed for ATS analysis." });
    return;
  }

  const [skills, [existing]] = await Promise.all([
    db.select().from(skillsTable).where(eq(skillsTable.userId, uid)),
    db.select().from(studentProfilesTable).where(eq(studentProfilesTable.userId, uid)),
  ]);

  let targetCompanyName: string | null = null;
  let targetRequiredSkills: string[] = [];
  const companyId = req.body?.companyId ? parseInt(req.body.companyId) : null;
  if (companyId) {
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, companyId));
    if (company) {
      targetCompanyName = company.name;
      targetRequiredSkills = company.requiredSkills ?? [];
    }
  }

  const analysis = analyzeResumeUpload({
    resumeText,
    studentSkills: skills.map(s => s.name),
    targetCompanyName,
    targetRequiredSkills,
  });

  // Persist extracted text so future AI analyses know a resume is on file.
  if (existing) {
    await db.update(studentProfilesTable)
      .set({ resumeText, resumeFileName: req.file.originalname, resumeUploadedAt: new Date() })
      .where(eq(studentProfilesTable.userId, uid));
  } else {
    await db.insert(studentProfilesTable).values({
      userId: uid, resumeText, resumeFileName: req.file.originalname, resumeUploadedAt: new Date(),
    });
  }

  res.json({ fileName: req.file.originalname, ...analysis });
});

export default router;
