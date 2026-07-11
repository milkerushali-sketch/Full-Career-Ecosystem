import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  description: text("description"),
  website: text("website"),
  logoUrl: text("logo_url"),
  minCGPARequired: numeric("min_cgpa_required", { precision: 4, scale: 2 }).notNull().default("0"),
  maxBacklogs: integer("max_backlogs").notNull().default(0),
  requiredSkills: text("required_skills").array().notNull().default([]),
  packageMin: numeric("package_min", { precision: 10, scale: 2 }),
  packageMax: numeric("package_max", { precision: 10, scale: 2 }),
  eligibleDepartments: text("eligible_departments").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobPostingsTable = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  companyId: integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
  description: text("description"),
  eligibilityCriteria: text("eligibility_criteria"),
  applicationDeadline: text("application_deadline"),
  status: text("status").notNull().default("open"), // 'open'|'closed'|'upcoming'
  ctc: numeric("ctc", { precision: 10, scale: 2 }),
  openings: integer("openings"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobApplicationsTable = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobPostingsTable.id, { onDelete: "cascade" }),
  studentId: integer("student_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("applied"), // 'applied'|'shortlisted'|'interviewed'|'offered'|'rejected'
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
});

export const interviewsTable = pgTable("interviews", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  companyId: integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
  jobId: integer("job_id").references(() => jobPostingsTable.id),
  scheduledAt: text("scheduled_at").notNull(),
  type: text("type").notNull(), // 'technical'|'hr'|'group_discussion'|'aptitude'|'final'
  status: text("status").notNull().default("scheduled"), // 'scheduled'|'completed'|'cancelled'|'rescheduled'
  venue: text("venue"),
  feedback: text("feedback"),
  result: text("result"),
});

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("system"), // 'interview'|'job'|'placement'|'system'|'reminder'
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Company = typeof companiesTable.$inferSelect;
export type JobPosting = typeof jobPostingsTable.$inferSelect;
export type JobApplication = typeof jobApplicationsTable.$inferSelect;
export type Interview = typeof interviewsTable.$inferSelect;
export type PlacementNotification = typeof notificationsTable.$inferSelect;
