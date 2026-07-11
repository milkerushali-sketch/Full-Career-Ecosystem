import { Router } from "express";
import { db } from "@workspace/db";
import { companiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

const formatCompany = (c: typeof companiesTable.$inferSelect) => ({
  ...c,
  minCGPA: c.minCGPARequired ? parseFloat(c.minCGPARequired) : null,
  minCGPARequired: parseFloat(c.minCGPARequired),
  packageMin: c.packageMin ? parseFloat(c.packageMin) : null,
  packageMax: c.packageMax ? parseFloat(c.packageMax) : null,
  requiredSkills: c.requiredSkills ?? [],
  eligibleDepartments: c.eligibleDepartments ?? [],
});

router.get("/companies", requireAuth, async (req, res): Promise<void> => {
  const rows = await db.select().from(companiesTable).orderBy(companiesTable.name);
  res.json(rows.map(formatCompany));
});

router.post("/companies", requireAuth, requireRole("officer", "admin"), async (req, res): Promise<void> => {
  const { name, industry, description, website, logoUrl, minCGPARequired, maxBacklogs,
    requiredSkills, packageMin, packageMax, eligibleDepartments } = req.body;
  if (!name || !industry) { res.status(400).json({ error: "name and industry are required" }); return; }

  const [company] = await db.insert(companiesTable).values({
    name, industry, description, website, logoUrl,
    minCGPARequired: String(minCGPARequired ?? 0),
    maxBacklogs: maxBacklogs ?? 0,
    requiredSkills: requiredSkills ?? [],
    packageMin: packageMin != null ? String(packageMin) : null,
    packageMax: packageMax != null ? String(packageMax) : null,
    eligibleDepartments: eligibleDepartments ?? [],
  }).returning();

  res.status(201).json(formatCompany(company));
});

router.get("/companies/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
  if (!company) { res.status(404).json({ error: "Company not found" }); return; }
  res.json(formatCompany(company));
});

router.patch("/companies/:id", requireAuth, requireRole("officer", "admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const body = {
    ...req.body,
    minCGPARequired: req.body.minCGPARequired != null ? String(req.body.minCGPARequired) : undefined,
    packageMin: req.body.packageMin != null ? String(req.body.packageMin) : undefined,
    packageMax: req.body.packageMax != null ? String(req.body.packageMax) : undefined,
  };
  const [company] = await db.update(companiesTable).set(body).where(eq(companiesTable.id, id)).returning();
  if (!company) { res.status(404).json({ error: "Company not found" }); return; }
  res.json(formatCompany(company));
});

router.delete("/companies/:id", requireAuth, requireRole("officer", "admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  await db.delete(companiesTable).where(eq(companiesTable.id, id));
  res.sendStatus(204);
});

export default router;
