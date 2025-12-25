import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const posters = pgTable("posters", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  centerName: text("center_name").notNull(),
  orientation: text("orientation").notNull(), // 'portrait' | 'landscape'
  content: jsonb("content").notNull(), // { title: string, points: string[] }
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPosterSchema = createInsertSchema(posters).omit({ 
  id: true, 
  createdAt: true 
});

export type Poster = typeof posters.$inferSelect;
export type InsertPoster = z.infer<typeof insertPosterSchema>;

export type GeneratePosterRequest = {
  topic: string;
  centerName: string;
  orientation: "portrait" | "landscape";
};

export type GeneratePosterResponse = {
  title: string;
  points: string[];
};
