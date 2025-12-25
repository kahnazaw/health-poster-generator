import { db } from "./db";
import { posters, type InsertPoster, type Poster } from "@shared/schema";

export interface IStorage {
  createPoster(poster: InsertPoster): Promise<Poster>;
  getPosters(): Promise<Poster[]>;
}

export class DatabaseStorage implements IStorage {
  async createPoster(insertPoster: InsertPoster): Promise<Poster> {
    const [poster] = await db.insert(posters).values(insertPoster).returning();
    return poster;
  }

  async getPosters(): Promise<Poster[]> {
    return await db.select().from(posters);
  }
}

export const storage = new DatabaseStorage();
