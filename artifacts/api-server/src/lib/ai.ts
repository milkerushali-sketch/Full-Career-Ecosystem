// Simulated AI analysis engine — rule-based scoring that mirrors what a
// Python/ML service would produce.

interface SkillRow {
  name: string;
  level: string;
  category: string;
}

interface CodingProfile {
  leetcodeSolved?: number | null;
  githubUsername?: string | null;
  hackerrankUsername?: string | null;
  codeforcesRating?: number | null;
}

interface AnalysisInput {
  cgpa: number;
  backlogs: number;
  skills: SkillRow[];
  projectCount: number;
  certCount: number;
  internCount: number;
  codingProfile: CodingProfile | null;
  hasResume: boolean;
}

const COMMON_SKILLS = [
  { name: "Data Structures & Algorithms", category: "CS Fundamentals", priority: "high" as const },
  { name: "SQL / Databases", category: "Database", priority: "high" as const },
  { name: "System Design", category: "CS Fundamentals", priority: "high" as const },
  { name: "Git / Version Control", category: "Tools", priority: "medium" as const },
  { name: "REST APIs", category: "Backend", priority: "medium" as const },
  { name: "Python", category: "Programming", priority: "medium" as const },
  { name: "JavaScript / TypeScript", category: "Frontend", priority: "medium" as const },
  { name: "Problem Solving", category: "CS Fundamentals", priority: "low" as const },
  { name: "Communication", category: "Soft Skills", priority: "low" as const },
];

const COURSE_RECOMMENDATIONS = [
  { title: "DSA Masterclass", provider: "LeetCode", type: "practice" as const, url: "https://leetcode.com", priority: "high" as const, skill: "Data Structures & Algorithms", estimatedHours: 80 },
  { title: "SQL for Data Analysis", provider: "Mode", type: "course" as const, url: "https://mode.com/sql-tutorial", priority: "high" as const, skill: "SQL / Databases", estimatedHours: 20 },
  { title: "System Design Primer", provider: "GitHub", type: "course" as const, url: "https://github.com/donnemartin/system-design-primer", priority: "high" as const, skill: "System Design", estimatedHours: 40 },
  { title: "Git & GitHub Bootcamp", provider: "Udemy", type: "course" as const, url: "https://udemy.com", priority: "medium" as const, skill: "Git / Version Control", estimatedHours: 10 },
  { title: "REST API Design", provider: "FreeCodeCamp", type: "course" as const, url: "https://freecodecamp.org", priority: "medium" as const, skill: "REST APIs", estimatedHours: 15 },
  { title: "Python for Everybody", provider: "Coursera", type: "course" as const, url: "https://coursera.org", priority: "medium" as const, skill: "Python", estimatedHours: 30 },
  { title: "JavaScript / TypeScript Fundamentals", provider: "freeCodeCamp", type: "course" as const, url: "https://freecodecamp.org", priority: "medium" as const, skill: "JavaScript / TypeScript", estimatedHours: 25 },
  { title: "AWS Certified Cloud Practitioner", provider: "AWS", type: "certification" as const, url: "https://aws.amazon.com/certification", priority: "high" as const, skill: "Cloud", estimatedHours: 30 },
  { title: "Open-Source Contribution", provider: "GitHub", type: "project" as const, url: "https://github.com/explore", priority: "medium" as const, skill: "Collaboration", estimatedHours: 20 },
];

export function computeAIAnalysis(input: AnalysisInput) {
  const { cgpa, backlogs, skills, projectCount, certCount, internCount, codingProfile, hasResume } = input;

  // ── Readiness Score (0–100) ─────────────────────────────────────────
  const cgpaScore = Math.min((cgpa / 10) * 25, 25);               // 0–25
  const skillScore = Math.min(skills.length * 2, 20);              // 0–20
  const projectScore = Math.min(projectCount * 4, 16);             // 0–16
  const certScore = Math.min(certCount * 3, 12);                   // 0–12
  const internScore = Math.min(internCount * 5, 15);               // 0–15
  const codingScore = codingProfile
    ? Math.min((codingProfile.leetcodeSolved ?? 0) / 20 + (codingProfile.codeforcesRating ?? 0) / 200 + (codingProfile.hackerrankUsername ? 2 : 0), 8)
    : 0;                                                            // 0–8
  const resumeBonus = hasResume ? 4 : 0;                           // 0–4
  const backlogPenalty = Math.min(backlogs * 3, 15);               // penalty
  const readinessScore = Math.max(0, Math.min(100, Math.round(
    cgpaScore + skillScore + projectScore + certScore + internScore + codingScore + resumeBonus - backlogPenalty
  )));

  // ── Resume Score (0–100) ────────────────────────────────────────────
  const resumeScore = Math.round(
    (cgpaScore / 25 * 20) +
    (skillScore / 20 * 25) +
    (projectScore / 16 * 25) +
    (certScore / 12 * 15) +
    (internScore / 15 * 15)
  );

  // ── Skill Gap ────────────────────────────────────────────────────────
  const studentSkillNames = skills.map(s => s.name.toLowerCase());
  const skillGaps = COMMON_SKILLS
    .filter(cs => !studentSkillNames.some(s => s.includes(cs.name.toLowerCase().split(" ")[0])))
    .map(cs => ({
      skill: cs.name,
      gap: `No ${cs.name} skills detected in your profile`,
      priority: cs.priority,
    }))
    .slice(0, 6);

  // ── Recommendations ──────────────────────────────────────────────────
  const recommendations = COURSE_RECOMMENDATIONS
    .filter(rec => skillGaps.some(g => g.skill.toLowerCase().includes(rec.skill.toLowerCase().split(" ")[0])))
    .slice(0, 5)
    .map(rec => ({
      title: rec.title,
      provider: rec.provider,
      type: rec.type,
      url: rec.url,
      priority: rec.priority,
      estimatedHours: rec.estimatedHours,
    }));

  // Add general recommendations if too few
  if (recommendations.length < 3) {
    recommendations.push(...COURSE_RECOMMENDATIONS.slice(0, 3 - recommendations.length));
  }

  // ── Strengths & Weaknesses ──────────────────────────────────────────
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (cgpa >= 8.0) strengths.push("Excellent academic performance (CGPA ≥ 8.0)");
  else if (cgpa >= 7.0) strengths.push("Good academic performance");
  else weaknesses.push("Academic performance below 7.0 CGPA may limit eligibility");

  if (skills.length >= 8) strengths.push(`Strong skill portfolio with ${skills.length} skills`);
  else if (skills.length < 4) weaknesses.push("Limited skill set — add more technical skills");

  if (projectCount >= 3) strengths.push(`${projectCount} projects demonstrate hands-on experience`);
  else if (projectCount === 0) weaknesses.push("No projects listed — build at least 2–3 projects");

  if (internCount >= 1) strengths.push(`${internCount} internship(s) show real-world experience`);
  else weaknesses.push("No internship experience — consider applying to internship programs");

  if (certCount >= 2) strengths.push(`${certCount} certifications validate expertise`);

  if (backlogs > 0) weaknesses.push(`${backlogs} active backlog(s) reduce company eligibility`);

  if (codingProfile?.leetcodeSolved && codingProfile.leetcodeSolved >= 100)
    strengths.push(`${codingProfile.leetcodeSolved} LeetCode problems solved`);

  if (!hasResume) weaknesses.push("No resume uploaded — upload your resume to unlock AI resume scoring");

  return {
    readinessScore,
    resumeScore,
    skillGaps,
    recommendations,
    strengths,
    weaknesses,
    analysisDate: new Date().toISOString(),
  };
}
