import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const departmentsTable = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  hodName: text("hod_name"),
});

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("student"), // 'student' | 'officer' | 'admin'
  isActive: boolean("is_active").notNull().default(true),
  departmentId: integer("department_id").references(() => departmentsTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDepartmentSchema = createInsertSchema(departmentsTable);
export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });

export type Department = typeof departmentsTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
