import { pgTable, text, serial, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const approvedTopics = pgTable("approved_topics", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  points: jsonb("points").notNull().$type<string[]>(),
  isActive: boolean("is_active").default(true),
});

export const userPosters = pgTable("user_posters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  topicId: integer("topic_id").notNull().references(() => approvedTopics.id),
  centerName: text("center_name").notNull(),
  orientation: text("orientation").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true,
  passwordHash: true 
}).extend({
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const insertApprovedTopicSchema = createInsertSchema(approvedTopics).omit({ 
  id: true 
});

export const insertUserPosterSchema = createInsertSchema(userPosters).omit({ 
  id: true, 
  createdAt: true 
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type ApprovedTopic = typeof approvedTopics.$inferSelect;
export type InsertApprovedTopic = z.infer<typeof insertApprovedTopicSchema>;

export type UserPoster = typeof userPosters.$inferSelect;
export type InsertUserPoster = z.infer<typeof insertUserPosterSchema>;

export type CreatePosterRequest = {
  topicId: number;
  centerName: string;
  orientation: "portrait" | "landscape";
};

export type PosterContent = {
  title: string;
  points: string[];
  topicId: number;
};
