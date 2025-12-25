import { pgTable, text, serial, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const healthTips = pgTable("health_tips", {
  id: serial("id").primaryKey(),
  textAr: text("text_ar").notNull(),
  textEn: text("text_en"),
  icon: text("icon"),
  isActive: boolean("is_active").default(true),
});

export const adminNotifications = pgTable("admin_notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: integer("related_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  healthCenter: text("health_center").notNull().default("غير محدد"),
  role: text("role").default("user"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const approvedTopics = pgTable("approved_topics", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  titleKu: text("title_ku"),
  points: jsonb("points").notNull().$type<string[]>(),
  pointsEn: jsonb("points_en").$type<string[]>(),
  pointsKu: jsonb("points_ku").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  scheduleDate: text("schedule_date"),
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
  passwordHash: true,
  role: true,
  status: true,
}).extend({
  password: z.string().min(6),
  healthCenter: z.string().min(2, "اسم المركز الصحي مطلوب"),
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
  colorTheme?: string;
};

export type PosterContent = {
  title: string;
  points: string[];
  topicId: number;
};

export type HealthTip = typeof healthTips.$inferSelect;
export type AdminNotification = typeof adminNotifications.$inferSelect;
