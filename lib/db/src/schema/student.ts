import { pgTable, serial, text, integer, numeric, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const studentProfilesTable = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => usersTable.id, { onDelete: "cascade" }),
  rollNo: text("roll_no"),
  phone: text("phone"),
  batch: text("batch"),
  cgpa: numeric("cgpa", { precision: 4, scale: 2 }),
  backlogs: integer("backlogs").notNull().default(0),
  address: text("address"),
  bio: text("bio"),
  linkedinUrl: text("linkedin_url"),
  resumeUrl: text("resume_url"),
  resumeText: text("resume_text"),
  resumeFileName: text("resume_file_name"),
  resumeUploadedAt: timestamp("resume_uploaded_at"),
  photoUrl: text("photo_url"),
});

export const semesterRecordsTable = pgTable("semester_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  semester: integer("semester").notNull(),
  sgpa: numeric("sgpa", { precision: 4, scale: 2 }).notNull(),
  year: text("year").notNull(),
  backlogs: integer("backlogs").notNull().default(0),
});

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  level: text("level").notNull().default("beginner"), // 'beginner'|'intermediate'|'advanced'
  category: text("category").notNull(),
});

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  techStack: text("tech_stack").array().default([]),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  startDate: text("start_date"),
  endDate: text("end_date"),
});

export const internshipsTable = pgTable("internships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  company: text("company").notNull(),
  role: text("role").notNull(),
  description: text("description"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  stipend: numeric("stipend", { precision: 10, scale: 2 }),
  location: text("location"),
  offerLetterUrl: text("offer_letter_url"),
});

export const certificationsTable = pgTable("certifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date"),
  expiryDate: text("expiry_date"),
  credentialUrl: text("credential_url"),
  credentialId: text("credential_id"),
});

export const codingProfilesTable = pgTable("coding_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => usersTable.id, { onDelete: "cascade" }),
  githubUsername: text("github_username"),
  githubUrl: text("github_url"),
  leetcodeUsername: text("leetcode_username"),
  leetcodeSolved: integer("leetcode_solved"),
  hackerrankUsername: text("hackerrank_username"),
  hackerrankBadges: integer("hackerrank_badges"),
  codeforcesUsername: text("codeforces_username"),
  codeforcesRating: integer("codeforces_rating"),
});

export const aiAnalysesTable = pgTable("ai_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  readinessScore: numeric("readiness_score", { precision: 5, scale: 2 }).notNull(),
  resumeScore: numeric("resume_score", { precision: 5, scale: 2 }).notNull(),
  skillGaps: jsonb("skill_gaps").notNull().default([]),
  recommendations: jsonb("recommendations").notNull().default([]),
  strengths: text("strengths").array().default([]),
  weaknesses: text("weaknesses").array().default([]),
  analysisDate: timestamp("analysis_date").notNull().defaultNow(),
});

export type StudentProfile = typeof studentProfilesTable.$inferSelect;
export type SemesterRecord = typeof semesterRecordsTable.$inferSelect;
export type Skill = typeof skillsTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
export type Internship = typeof internshipsTable.$inferSelect;
export type Certification = typeof certificationsTable.$inferSelect;
export type CodingProfile = typeof codingProfilesTable.$inferSelect;
export type AIAnalysis = typeof aiAnalysesTable.$inferSelect;
