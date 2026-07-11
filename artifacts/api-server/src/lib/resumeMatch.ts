// Rule-based ATS matching engine for an uploaded resume PDF.
// Compares extracted resume text against a target company's required skills
// (or a general keyword bank when no target is chosen) and scores ATS-readiness
// of the document formatting itself. No external LLM call — deterministic and
// works without any AI billing.

const GENERAL_KEYWORDS = [
  "data structures", "algorithms", "sql", "database", "system design", "git",
  "rest api", "python", "javascript", "typescript", "java", "react", "node",
  "cloud", "aws", "docker", "communication", "leadership", "problem solving",
  "testing", "ci/cd", "agile",
];

export interface ResumeUploadAnalysisInput {
  resumeText: string;
  studentSkills: string[];
  targetCompanyName?: string | null;
  targetRequiredSkills?: string[];
}

export interface ResumeUploadAnalysis {
  atsScore: number;
  formattingScore: number;
  keywordScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingIssues: string[];
  recommendations: string[];
  targetCompanyName: string | null;
  extractedWordCount: number;
}

function checkFormatting(text: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 150) { issues.push("Resume text is very short — ATS systems may flag it as incomplete."); score -= 20; }
  if (wordCount > 1200) { issues.push("Resume is very long — aim for 1 page (freshers) to 2 pages max."); score -= 10; }

  const lower = text.toLowerCase();
  if (!/@/.test(text)) { issues.push("No email address detected — ensure contact info is plain text, not inside an image."); score -= 15; }
  if (!/\+?\d[\d\s-]{7,}\d/.test(text)) { issues.push("No phone number detected in plain text."); score -= 10; }
  if (!lower.includes("skill")) { issues.push("No clear 'Skills' section detected — add one with an exact heading."); score -= 10; }
  if (!lower.includes("experience") && !lower.includes("intern") && !lower.includes("project")) {
    issues.push("No 'Experience' / 'Projects' section detected."); score -= 10;
  }
  if (!lower.includes("education") && !lower.includes("cgpa") && !lower.includes("degree")) {
    issues.push("No 'Education' section detected."); score -= 10;
  }

  return { score: Math.max(0, score), issues };
}

export function analyzeResumeUpload(input: ResumeUploadAnalysisInput): ResumeUploadAnalysis {
  const { resumeText, studentSkills, targetCompanyName, targetRequiredSkills } = input;
  const lower = resumeText.toLowerCase();

  const keywordBank = (targetRequiredSkills && targetRequiredSkills.length > 0)
    ? targetRequiredSkills
    : (studentSkills.length > 0 ? Array.from(new Set([...studentSkills, ...GENERAL_KEYWORDS])) : GENERAL_KEYWORDS);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  for (const kw of keywordBank) {
    if (lower.includes(kw.toLowerCase())) matchedKeywords.push(kw);
    else missingKeywords.push(kw);
  }

  const keywordScore = keywordBank.length > 0
    ? Math.round((matchedKeywords.length / keywordBank.length) * 100)
    : 100;

  const { score: formattingScore, issues: formattingIssues } = checkFormatting(resumeText);

  const atsScore = Math.round(keywordScore * 0.65 + formattingScore * 0.35);

  const recommendations: string[] = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Add these ${targetCompanyName ? `${targetCompanyName}-relevant` : "commonly screened"} keywords to your resume: ${missingKeywords.slice(0, 8).join(", ")}.`
    );
  }
  if (formattingIssues.length > 0) recommendations.push(...formattingIssues.map(i => `Fix: ${i}`));
  if (atsScore >= 80) recommendations.push("Strong ATS match — this resume is in good shape for automated screening.");
  else if (atsScore >= 60) recommendations.push("Decent ATS match — closing the keyword gaps above should meaningfully improve your score.");
  else recommendations.push("Low ATS match — rework the resume to mirror the target role's language before applying.");

  return {
    atsScore: Math.max(0, Math.min(100, atsScore)),
    formattingScore,
    keywordScore,
    matchedKeywords,
    missingKeywords,
    formattingIssues,
    recommendations,
    targetCompanyName: targetCompanyName ?? null,
    extractedWordCount: resumeText.split(/\s+/).filter(Boolean).length,
  };
}
