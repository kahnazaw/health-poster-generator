import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import session from "express-session";
import { seedTopics } from "./seed";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "غير مصرح" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const PgSession = connectPgSimple(session);
  
  app.use(session({
    store: new PgSession({
      pool: pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "health-poster-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }));

  await seedTopics();

  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقاً" });
      }
      
      const user = await storage.createUser(data);
      req.session.userId = user.id;
      
      res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email 
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "فشل التسجيل" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.validatePassword(email, password);
      if (!user) {
        return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
      }
      
      req.session.userId = user.id;
      
      res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email 
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "فشل تسجيل الدخول" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "فشل تسجيل الخروج" });
      }
      res.json({ message: "تم تسجيل الخروج بنجاح" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "غير مصرح" });
    }
    
    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "مستخدم غير موجود" });
    }
    
    res.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email 
    });
  });

  app.get("/api/topics", async (req, res) => {
    const topics = await storage.getApprovedTopics();
    res.json(topics);
  });

  app.get("/api/topics/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const topic = await storage.getApprovedTopicById(id);
    
    if (!topic) {
      return res.status(404).json({ 
        message: "لا يتوفر نص معتمد لهذا الموضوع حالياً" 
      });
    }
    
    res.json(topic);
  });

  app.post("/api/posters", requireAuth, async (req, res) => {
    try {
      const { topicId, centerName, orientation } = req.body;
      
      const topic = await storage.getApprovedTopicById(topicId);
      if (!topic) {
        return res.status(404).json({ 
          message: "لا يتوفر نص معتمد لهذا الموضوع حالياً" 
        });
      }
      
      const poster = await storage.createUserPoster({
        userId: req.session.userId!,
        topicId,
        centerName,
        orientation,
      });
      
      res.json({
        poster,
        content: {
          title: topic.title,
          points: topic.points,
        }
      });
    } catch (error: any) {
      console.error("Create poster error:", error);
      res.status(500).json({ message: "فشل إنشاء البوستر" });
    }
  });

  app.get("/api/posters/archive", requireAuth, async (req, res) => {
    try {
      const posters = await storage.getUserPosters(req.session.userId!);
      res.json(posters);
    } catch (error) {
      console.error("Archive error:", error);
      res.status(500).json({ message: "فشل جلب الأرشيف" });
    }
  });

  return httpServer;
}
