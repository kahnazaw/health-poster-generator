import { db } from "./db";
import { 
  users, approvedTopics, userPosters,
  type User, type InsertUser, 
  type ApprovedTopic, type InsertApprovedTopic,
  type UserPoster, type InsertUserPoster 
} from "@shared/schema";
import { eq, sql, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  createUser(data: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: number): Promise<User | null>;
  validatePassword(email: string, password: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: number, role: string): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  
  getApprovedTopics(): Promise<ApprovedTopic[]>;
  getAllTopics(): Promise<ApprovedTopic[]>;
  getApprovedTopicById(id: number): Promise<ApprovedTopic | null>;
  createApprovedTopic(data: InsertApprovedTopic): Promise<ApprovedTopic>;
  updateApprovedTopic(id: number, data: Partial<InsertApprovedTopic>): Promise<ApprovedTopic | null>;
  deleteApprovedTopic(id: number): Promise<boolean>;
  
  createUserPoster(data: InsertUserPoster): Promise<UserPoster>;
  getUserPosters(userId: number): Promise<(UserPoster & { topic: ApprovedTopic })[]>;
  getAllPosters(): Promise<(UserPoster & { topic: ApprovedTopic; user: { name: string } })[]>;
  
  getStats(): Promise<{ users: number; topics: number; posters: number }>;
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

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserRole(id: number, role: string): Promise<User | null> {
    const [user] = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
    return user || null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async getApprovedTopics(): Promise<ApprovedTopic[]> {
    return await db.select().from(approvedTopics).where(eq(approvedTopics.isActive, true));
  }

  async getAllTopics(): Promise<ApprovedTopic[]> {
    return await db.select().from(approvedTopics);
  }

  async getApprovedTopicById(id: number): Promise<ApprovedTopic | null> {
    const [topic] = await db.select().from(approvedTopics).where(eq(approvedTopics.id, id));
    return topic || null;
  }

  async createApprovedTopic(data: InsertApprovedTopic): Promise<ApprovedTopic> {
    const [topic] = await db.insert(approvedTopics).values(data).returning();
    return topic;
  }

  async updateApprovedTopic(id: number, data: Partial<InsertApprovedTopic>): Promise<ApprovedTopic | null> {
    const [topic] = await db.update(approvedTopics).set(data).where(eq(approvedTopics.id, id)).returning();
    return topic || null;
  }

  async deleteApprovedTopic(id: number): Promise<boolean> {
    await db.delete(approvedTopics).where(eq(approvedTopics.id, id));
    return true;
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

  async getAllPosters(): Promise<(UserPoster & { topic: ApprovedTopic; user: { name: string } })[]> {
    const posters = await db.select().from(userPosters).orderBy(desc(userPosters.createdAt));
    const result: (UserPoster & { topic: ApprovedTopic; user: { name: string } })[] = [];
    
    for (const poster of posters) {
      const topic = await this.getApprovedTopicById(poster.topicId);
      const user = await this.getUserById(poster.userId);
      if (topic && user) {
        result.push({ ...poster, topic, user: { name: user.name } });
      }
    }
    
    return result;
  }

  async getStats(): Promise<{ users: number; topics: number; posters: number }> {
    const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [topicsCount] = await db.select({ count: sql<number>`count(*)` }).from(approvedTopics);
    const [postersCount] = await db.select({ count: sql<number>`count(*)` }).from(userPosters);
    
    return {
      users: Number(usersCount.count),
      topics: Number(topicsCount.count),
      posters: Number(postersCount.count),
    };
  }
}

export const storage = new DatabaseStorage();
