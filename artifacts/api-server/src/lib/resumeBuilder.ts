// Deterministic ATS-friendly resume builder.
// Generates a structured, ATS-safe resume (single column, plain text, no tables/graphics)
// straight from the student's stored profile data. Kept rule-based (no external LLM call)
// so the feature works without any paid AI provider.

export interface ResumeSkill { name: string; level: string; category: string; }
export interface ResumeProject { title: string; description?: string | null; techStack?: string[] | null; githubUrl?: string | null; liveUrl?: string | null; startDate?: string | null; endDate?: string | null; }
export interface ResumeInternship { company: string; role: string; description?: string | null; startDate?: string | null; endDate?: string | null; location?: string | null; }
export interface ResumeCertification { name: string; issuer: string; issueDate?: string | null; }
export interface ResumeSemester { semester: number; sgpa: number; year: string; }
export interface ResumeCodingProfile {
  githubUsername?: string | null;
  leetcodeUsername?: string | null;
  leetcodeSolved?: number | null;
  hackerrankUsername?: string | null;
  codeforcesUsername?: string | null;
  codeforcesRating?: number | null;
}

export interface BuildResumeInput {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  linkedinUrl?: string | null;
  bio?: string | null;
  rollNo?: string | null;
  batch?: string | null;
  cgpa?: number | null;
  backlogs?: number;
  skills: ResumeSkill[];
  projects: ResumeProject[];
  internships: ResumeInternship[];
  certifications: ResumeCertification[];
  semesters: ResumeSemester[];
  codingProfile: ResumeCodingProfile | null;
}

export interface GeneratedResume {
  contact: { name: string; email: string; phone: string | null; address: string | null; linkedinUrl: string | null };
  summary: string;
  education: { degree: string; batch: string | null; cgpa: number | null; highlights: string[] };
  skillsByCategory: { category: string; skills: string[] }[];
  experience: { heading: string; bullets: string[] }[];
  projects: { heading: string; bullets: string[] }[];
  certifications: string[];
  codingProfiles: string[];
  atsTips: string[];
  formattedText: string;
}

const ACTION_VERBS = ["Built", "Developed", "Designed", "Implemented", "Engineered", "Led", "Optimized"];

function bulletForProject(p: ResumeProject, idx: number): string {
  const verb = ACTION_VERBS[idx % ACTION_VERBS.length];
  const tech = p.techStack && p.techStack.length > 0 ? ` using ${p.techStack.join(", ")}` : "";
  const desc = p.description ? ` — ${p.description}` : "";
  return `${verb} ${p.title}${tech}${desc}`.trim();
}

function bulletForInternship(i: ResumeInternship): string {
  const period = [i.startDate, i.endDate].filter(Boolean).join(" – ");
  const loc = i.location ? `, ${i.location}` : "";
  const desc = i.description ? ` ${i.description}` : " Contributed to real-world engineering tasks and cross-team collaboration.";
  return `${i.role} at ${i.company}${loc}${period ? ` (${period})` : ""}.${desc}`;
}

export function buildResume(input: BuildResumeInput): GeneratedResume {
  const {
    name, email, phone, address, linkedinUrl, bio, batch, cgpa, backlogs = 0,
    skills, projects, internships, certifications, semesters, codingProfile,
  } = input;

  // ── Summary ──────────────────────────────────────────────────────────────
  const topSkills = skills.slice(0, 5).map(s => s.name);
  const summaryParts: string[] = [];
  summaryParts.push(
    `${batch ? `${batch} ` : ""}graduate with hands-on experience across ${projects.length || 0} project${projects.length === 1 ? "" : "s"}` +
    `${internships.length ? ` and ${internships.length} internship${internships.length === 1 ? "" : "s"}` : ""}.`
  );
  if (topSkills.length) summaryParts.push(`Core strengths in ${topSkills.join(", ")}.`);
  if (cgpa != null) summaryParts.push(`Academic record of ${cgpa.toFixed(2)} CGPA${backlogs > 0 ? ` with ${backlogs} active backlog(s)` : ""}.`);
  if (bio) summaryParts.push(bio.trim());
  const summary = summaryParts.join(" ");

  // ── Education ────────────────────────────────────────────────────────────
  const highlights = semesters
    .slice()
    .sort((a, b) => a.semester - b.semester)
    .map(s => `Semester ${s.semester} (${s.year}): SGPA ${s.sgpa.toFixed(2)}`);

  // ── Skills grouped by category ───────────────────────────────────────────
  const categoryMap = new Map<string, string[]>();
  for (const s of skills) {
    const list = categoryMap.get(s.category) ?? [];
    list.push(s.name);
    categoryMap.set(s.category, list);
  }
  const skillsByCategory = Array.from(categoryMap.entries()).map(([category, list]) => ({ category, skills: list }));

  // ── Experience (internships) ─────────────────────────────────────────────
  const experience = internships.map(i => ({
    heading: `${i.role} — ${i.company}`,
    bullets: [bulletForInternship(i)],
  }));

  // ── Projects ──────────────────────────────────────────────────────────────
  const projectSections = projects.map((p, idx) => ({
    heading: p.title + (p.githubUrl ? ` (${p.githubUrl})` : ""),
    bullets: [bulletForProject(p, idx)],
  }));

  // ── Certifications ───────────────────────────────────────────────────────
  const certLines = certifications.map(c => `${c.name} — ${c.issuer}${c.issueDate ? ` (${c.issueDate})` : ""}`);

  // ── Coding profiles ───────────────────────────────────────────────────────
  const codingLines: string[] = [];
  if (codingProfile?.githubUsername) codingLines.push(`GitHub: ${codingProfile.githubUsername}`);
  if (codingProfile?.leetcodeUsername) codingLines.push(`LeetCode: ${codingProfile.leetcodeUsername}${codingProfile.leetcodeSolved ? ` (${codingProfile.leetcodeSolved} solved)` : ""}`);
  if (codingProfile?.hackerrankUsername) codingLines.push(`HackerRank: ${codingProfile.hackerrankUsername}`);
  if (codingProfile?.codeforcesUsername) codingLines.push(`Codeforces: ${codingProfile.codeforcesUsername}${codingProfile.codeforcesRating ? ` (rating ${codingProfile.codeforcesRating})` : ""}`);

  // ── ATS tips ──────────────────────────────────────────────────────────────
  const atsTips: string[] = [];
  if (skills.length < 6) atsTips.push("Add more relevant skills — ATS systems rank resumes higher when they match more job-description keywords.");
  if (projects.length === 0) atsTips.push("Add at least 2–3 projects; ATS parsers and recruiters weigh demonstrated work heavily.");
  if (!bio) atsTips.push("Add a short professional bio to strengthen your summary section.");
  if (!linkedinUrl) atsTips.push("Add your LinkedIn URL — many recruiters cross-check it after an ATS match.");
  atsTips.push("Keep this single-column, plain-text layout — tables, images, and multi-column layouts break ATS parsers.");
  atsTips.push("Save and submit as a text-based PDF (not a scanned image) so ATS software can read it.");

  // ── Formatted plain text (ATS-safe: single column, no tables/graphics) ───
  const lines: string[] = [];
  lines.push(name.toUpperCase());
  lines.push([email, phone, address, linkedinUrl].filter(Boolean).join(" | "));
  lines.push("");
  if (summary) { lines.push("PROFESSIONAL SUMMARY"); lines.push(summary); lines.push(""); }
  if (skillsByCategory.length) {
    lines.push("SKILLS");
    skillsByCategory.forEach(g => lines.push(`${g.category}: ${g.skills.join(", ")}`));
    lines.push("");
  }
  if (experience.length) {
    lines.push("EXPERIENCE");
    experience.forEach(e => { lines.push(e.heading); e.bullets.forEach(b => lines.push(`- ${b}`)); });
    lines.push("");
  }
  if (projectSections.length) {
    lines.push("PROJECTS");
    projectSections.forEach(p => { lines.push(p.heading); p.bullets.forEach(b => lines.push(`- ${b}`)); });
    lines.push("");
  }
  if (highlights.length || cgpa != null) {
    lines.push("EDUCATION");
    if (batch) lines.push(`Batch: ${batch}`);
    if (cgpa != null) lines.push(`CGPA: ${cgpa.toFixed(2)}`);
    highlights.forEach(h => lines.push(`- ${h}`));
    lines.push("");
  }
  if (certLines.length) { lines.push("CERTIFICATIONS"); certLines.forEach(c => lines.push(`- ${c}`)); lines.push(""); }
  if (codingLines.length) { lines.push("CODING PROFILES"); codingLines.forEach(c => lines.push(`- ${c}`)); lines.push(""); }

  return {
    contact: { name, email, phone: phone ?? null, address: address ?? null, linkedinUrl: linkedinUrl ?? null },
    summary,
    education: { degree: "B.Tech / Undergraduate Program", batch: batch ?? null, cgpa: cgpa ?? null, highlights },
    skillsByCategory,
    experience,
    projects: projectSections,
    certifications: certLines,
    codingProfiles: codingLines,
    atsTips,
    formattedText: lines.join("\n").trim(),
  };
}
