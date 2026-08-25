// Gemini enhancement layer for the resume features.
// This module owns prompts, response validation, and fallback behavior so the
// route module stays focused on authentication, persistence, and HTTP.

import { generateGeminiJson } from "./geminiClient";
import { analyzeResumeUpload, type ResumeUploadAnalysis } from "./resumeMatch";
import {
  buildResume,
  type BuildResumeInput,
  type GeneratedResume,
} from "./resumeBuilder";

function strings(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const result = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return result.length === value.length ? result : null;
}

function sections(value: unknown): GeneratedResume["projects"] | null {
  if (!Array.isArray(value)) return null;
  const result = value
    .filter((item): item is { heading: string; bullets: string[] } => (
      typeof item === "object" &&
      item !== null &&
      typeof (item as { heading?: unknown }).heading === "string" &&
      Array.isArray((item as { bullets?: unknown }).bullets) &&
      strings((item as { bullets: unknown }).bullets) !== null
    ))
    .map((item) => ({
      heading: item.heading.trim(),
      bullets: strings(item.bullets) ?? [],
    }));
  return result.length === value.length ? result : null;
}

function skillGroups(value: unknown): GeneratedResume["skillsByCategory"] | null {
  if (!Array.isArray(value)) return null;
  const result = value
    .filter((item): item is { category: string; skills: string[] } => (
      typeof item === "object" &&
      item !== null &&
      typeof (item as { category?: unknown }).category === "string" &&
      strings((item as { skills?: unknown }).skills) !== null
    ))
    .map((item) => ({
      category: item.category.trim(),
      skills: strings(item.skills) ?? [],
    }));
  return result.length === value.length ? result : null;
}

function applyResumeResponse(base: GeneratedResume, value: Partial<GeneratedResume>): GeneratedResume {
  const education = value.education && typeof value.education === "object"
    ? {
      ...base.education,
      ...(typeof value.education.degree === "string" ? { degree: value.education.degree } : {}),
      ...(typeof value.education.batch === "string" || value.education.batch === null ? { batch: value.education.batch } : {}),
      ...(typeof value.education.cgpa === "number" || value.education.cgpa === null ? { cgpa: value.education.cgpa } : {}),
      ...(strings(value.education.highlights) ? { highlights: strings(value.education.highlights)! } : {}),
    }
    : base.education;

  return {
    ...base,
    ...(typeof value.summary === "string" ? { summary: value.summary.trim() } : {}),
    education,
    ...(skillGroups(value.skillsByCategory) ? { skillsByCategory: skillGroups(value.skillsByCategory)! } : {}),
    ...(sections(value.experience) ? { experience: sections(value.experience)! } : {}),
    ...(sections(value.projects) ? { projects: sections(value.projects)! } : {}),
    ...(strings(value.certifications) ? { certifications: strings(value.certifications)! } : {}),
    ...(strings(value.codingProfiles) ? { codingProfiles: strings(value.codingProfiles)! } : {}),
    ...(strings(value.atsTips) ? { atsTips: strings(value.atsTips)! } : {}),
    ...(typeof value.formattedText === "string" && value.formattedText.trim().length > 0
      ? { formattedText: value.formattedText.trim() }
      : {}),
    generatedBy: "Gemini",
  };
}

export async function buildResumeWithGemini(input: BuildResumeInput): Promise<GeneratedResume> {
  const base = buildResume(input);
  const prompt = `You are an expert resume writer and ATS optimization specialist.
Create an honest, concise, single-column resume for the student below.
Use ONLY facts present in the profile or the deterministic draft. Never invent employers,
dates, metrics, degrees, technologies, URLs, or achievements. You may rewrite wording
with strong action verbs and improve section ordering. Keep it suitable for a fresher.

Return ONLY valid JSON with exactly these keys:
{
  "summary": "string",
  "education": {"degree": "string", "batch": "string|null", "cgpa": "number|null", "highlights": ["string"]},
  "skillsByCategory": [{"category": "string", "skills": ["string"]}],
  "experience": [{"heading": "string", "bullets": ["string"]}],
  "projects": [{"heading": "string", "bullets": ["string"]}],
  "certifications": ["string"],
  "codingProfiles": ["string"],
  "atsTips": ["string"],
  "formattedText": "plain text resume with section headings"
}

Student profile:
${JSON.stringify(input)}

Deterministic draft to improve:
${JSON.stringify(base)}`;

  const generated = await generateGeminiJson<Partial<GeneratedResume>>(prompt);
  return generated ? applyResumeResponse(base, generated) : { ...base, generatedBy: "Rule-based fallback" };
}

export async function analyzeResumeWithGemini(
  input: {
    resumeText: string;
    targetCompanyName?: string | null;
    targetRequiredSkills?: string[];
    studentSkills: string[];
  },
  fallback: ResumeUploadAnalysis,
): Promise<ResumeUploadAnalysis> {
  const target = input.targetCompanyName
    ? `Target company: ${input.targetCompanyName}
Required skills from the company's placement profile: ${JSON.stringify(input.targetRequiredSkills ?? [])}`
    : "No target company was selected. Evaluate against general software placement ATS expectations.";

  const prompt = `You are an ATS resume reviewer. Analyze the extracted resume text below.
${target}
Do not claim a skill is present unless it appears in the resume text. Give actionable,
truthful recommendations and do not invent job requirements beyond the supplied list.

Return ONLY valid JSON with exactly these keys:
{
  "atsScore": number from 0 to 100,
  "formattingScore": number from 0 to 100,
  "keywordScore": number from 0 to 100,
  "matchedKeywords": ["strings"],
  "missingKeywords": ["strings"],
  "formattingIssues": ["strings"],
  "recommendations": ["strings"]
}

Student profile skills (context only):
${JSON.stringify(input.studentSkills)}

Extracted resume text:
${input.resumeText.slice(0, 30_000)}`;

  const generated = await generateGeminiJson<Partial<ResumeUploadAnalysis>>(prompt);
  if (!generated) return { ...fallback, analyzedBy: "Rule-based fallback" };

  const bounded = (value: unknown, fallbackValue: number) => (
    typeof value === "number" && Number.isFinite(value)
      ? Math.max(0, Math.min(100, Math.round(value)))
      : fallbackValue
  );
  return {
    ...fallback,
    atsScore: bounded(generated.atsScore, fallback.atsScore),
    formattingScore: bounded(generated.formattingScore, fallback.formattingScore),
    keywordScore: bounded(generated.keywordScore, fallback.keywordScore),
    ...(strings(generated.matchedKeywords) ? { matchedKeywords: strings(generated.matchedKeywords)! } : {}),
    ...(strings(generated.missingKeywords) ? { missingKeywords: strings(generated.missingKeywords)! } : {}),
    ...(strings(generated.formattingIssues) ? { formattingIssues: strings(generated.formattingIssues)! } : {}),
    ...(strings(generated.recommendations) ? { recommendations: strings(generated.recommendations)! } : {}),
    analyzedBy: "Gemini",
  };
}