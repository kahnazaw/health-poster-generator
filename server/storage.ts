import { db } from "./db";
import { 
  users, approvedTopics, userPosters,
  type User, type InsertUser, 
  type ApprovedTopic, type InsertApprovedTopic,
  type UserPoster, type InsertUserPoster 
} from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  createUser(data: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: number): Promise<User | null>;
  validatePassword(email: string, password: string): Promise<User | null>;
  
  getApprovedTopics(): Promise<ApprovedTopic[]>;
  getApprovedTopicById(id: number): Promise<ApprovedTopic | null>;
  createApprovedTopic(data: InsertApprovedTopic): Promise<ApprovedTopic>;
  
  createUserPoster(data: InsertUserPoster): Promise<UserPoster>;
  getUserPosters(userId: number): Promise<(UserPoster & { topic: ApprovedTopic })[]>;
}

export class DatabaseStorage implements IStorage {
  async createUser(data: InsertUser): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const [user] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      passwordHash,
    }).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async getUserById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async getApprovedTopics(): Promise<ApprovedTopic[]> {
    return await db.select().from(approvedTopics).where(eq(approvedTopics.isActive, true));
  }

  async getApprovedTopicById(id: number): Promise<ApprovedTopic | null> {
    const [topic] = await db.select().from(approvedTopics).where(eq(approvedTopics.id, id));
    return topic || null;
  }

  async createApprovedTopic(data: InsertApprovedTopic): Promise<ApprovedTopic> {
    const [topic] = await db.insert(approvedTopics).values(data).returning();
    return topic;
  }

  async createUserPoster(data: InsertUserPoster): Promise<UserPoster> {
    const [poster] = await db.insert(userPosters).values(data).returning();
    return poster;
  }

  async getUserPosters(userId: number): Promise<(UserPoster & { topic: ApprovedTopic })[]> {
    const posters = await db.select().from(userPosters).where(eq(userPosters.userId, userId));
    const result: (UserPoster & { topic: ApprovedTopic })[] = [];
    
    for (const poster of posters) {
      const topic = await this.getApprovedTopicById(poster.topicId);
      if (topic) {
        result.push({ ...poster, topic });
      }
    }
    
    return result.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }
}

export const storage = new DatabaseStorage();
