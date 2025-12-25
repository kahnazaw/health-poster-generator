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
  getPendingUsers(): Promise<User[]>;
  updateUserRole(id: number, role: string): Promise<User | null>;
  updateUserStatus(id: number, status: string): Promise<User | null>;
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
  getDetailedAnalytics(): Promise<{
    postersByTopic: { topicTitle: string; count: number }[];
    postersByCenter: { centerName: string; count: number }[];
    postersByDate: { date: string; count: number }[];
    recentActivity: { name: string; topic: string; date: string }[];
    userStats: { name: string; healthCenter: string; posterCount: number }[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async createUser(data: InsertUser): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const [user] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      passwordHash,
      healthCenter: data.healthCenter,
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

  async getPendingUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.status, "pending")).orderBy(desc(users.createdAt));
  }

  async updateUserRole(id: number, role: string): Promise<User | null> {
    const [user] = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
    return user || null;
  }

  async updateUserStatus(id: number, status: string): Promise<User | null> {
    const [user] = await db.update(users).set({ status }).where(eq(users.id, id)).returning();
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

  async getDetailedAnalytics(): Promise<{
    postersByTopic: { topicTitle: string; count: number }[];
    postersByCenter: { centerName: string; count: number }[];
    postersByDate: { date: string; count: number }[];
    recentActivity: { name: string; topic: string; date: string }[];
    userStats: { name: string; healthCenter: string; posterCount: number }[];
  }> {
    const allPosters = await this.getAllPosters();
    const allUsers = await this.getAllUsers();
    
    const topicCounts: Record<string, number> = {};
    const centerCounts: Record<string, number> = {};
    const dateCounts: Record<string, number> = {};
    const userPosterCounts: Record<number, number> = {};
    
    for (const poster of allPosters) {
      const topicTitle = poster.topic.title;
      topicCounts[topicTitle] = (topicCounts[topicTitle] || 0) + 1;
      
      const centerName = poster.centerName;
      centerCounts[centerName] = (centerCounts[centerName] || 0) + 1;
      
      const date = new Date(poster.createdAt!).toISOString().split('T')[0];
      dateCounts[date] = (dateCounts[date] || 0) + 1;
      
      userPosterCounts[poster.userId] = (userPosterCounts[poster.userId] || 0) + 1;
    }
    
    const postersByTopic = Object.entries(topicCounts)
      .map(([topicTitle, count]) => ({ topicTitle, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const postersByCenter = Object.entries(centerCounts)
      .map(([centerName, count]) => ({ centerName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const postersByDate = Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);
    
    const recentActivity = allPosters.slice(0, 10).map(p => ({
      name: p.user.name,
      topic: p.topic.title,
      date: new Date(p.createdAt!).toLocaleDateString('ar-IQ'),
    }));
    
    const userStats = allUsers
      .filter(u => u.role !== 'admin')
      .map(u => ({
        name: u.name,
        healthCenter: u.healthCenter || 'غير محدد',
        posterCount: userPosterCounts[u.id] || 0,
      }))
      .sort((a, b) => b.posterCount - a.posterCount);
    
    return {
      postersByTopic,
      postersByCenter,
      postersByDate,
      recentActivity,
      userStats,
    };
  }
}

export const storage = new DatabaseStorage();
