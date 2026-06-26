import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectStatusEnum = pgEnum("project_status", [
  "new",
  "contacted",
  "in_progress",
  "closed",
]);

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectNumber: text("project_number").notNull().unique(),
  status: projectStatusEnum("status").notNull().default("new"),
  companyName: text("company_name"),
  contactName: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  projectType: text("project_type"),
  objectives: text("objectives"),
  budget: text("budget"),
  deadline: text("deadline"),
  description: text("description"),
  answers: text("answers"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({
  id: true,
  projectNumber: true,
  status: true,
  createdAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
