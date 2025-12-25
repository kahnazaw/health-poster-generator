import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertApprovedTopicSchema } from "@shared/schema";
import session from "express-session";
import { seedTopics } from "./seed";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { registerImageRoutes } from "./replit_integrations/image";
import puppeteer from "puppeteer";

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

const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "غير مصرح" });
  }
  const user = await storage.getUserById(req.session.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "صلاحيات المدير مطلوبة" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const PgSession = connectPgSimple(session);
  
  // Trust proxy for Replit deployment
  app.set("trust proxy", 1);
  
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
      
      res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        status: user.status,
        message: "تم إنشاء الحساب بنجاح. يرجى انتظار موافقة المدير.",
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
      
      if (user.status === "pending") {
        return res.status(403).json({ message: "حسابك قيد المراجعة. يرجى انتظار موافقة المدير." });
      }
      
      if (user.status === "rejected") {
        return res.status(403).json({ message: "تم رفض طلب التسجيل الخاص بك." });
      }
      
      req.session.userId = user.id;
      
      res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        status: user.status,
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
      email: user.email,
      role: user.role,
      status: user.status,
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

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "فشل جلب الإحصائيات" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })));
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "فشل جلب المستخدمين" });
    }
  });

  app.get("/api/admin/pending-users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getPendingUsers();
      res.json(users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
      })));
    } catch (error) {
      console.error("Get pending users error:", error);
      res.status(500).json({ message: "فشل جلب المستخدمين المعلقين" });
    }
  });

  app.patch("/api/admin/users/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "حالة غير صالحة" });
      }
      
      const user = await storage.updateUserStatus(id, status);
      if (!user) {
        return res.status(404).json({ message: "مستخدم غير موجود" });
      }
      
      res.json({ id: user.id, name: user.name, email: user.email, status: user.status });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({ message: "فشل تحديث الحالة" });
    }
  });

  app.patch("/api/admin/users/:id/role", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { role } = req.body;
      
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "صلاحية غير صالحة" });
      }
      
      const user = await storage.updateUserRole(id, role);
      if (!user) {
        return res.status(404).json({ message: "مستخدم غير موجود" });
      }
      
      res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
      console.error("Update role error:", error);
      res.status(500).json({ message: "فشل تحديث الصلاحية" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (id === req.session.userId) {
        return res.status(400).json({ message: "لا يمكنك حذف نفسك" });
      }
      
      await storage.deleteUser(id);
      res.json({ message: "تم حذف المستخدم" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "فشل حذف المستخدم" });
    }
  });

  app.get("/api/admin/topics", requireAdmin, async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      console.error("Get topics error:", error);
      res.status(500).json({ message: "فشل جلب المواضيع" });
    }
  });

  app.post("/api/admin/topics", requireAdmin, async (req, res) => {
    try {
      const data = insertApprovedTopicSchema.parse(req.body);
      const topic = await storage.createApprovedTopic(data);
      res.json(topic);
    } catch (error: any) {
      console.error("Create topic error:", error);
      res.status(400).json({ message: error.message || "فشل إنشاء الموضوع" });
    }
  });

  app.patch("/api/admin/topics/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const topic = await storage.updateApprovedTopic(id, req.body);
      
      if (!topic) {
        return res.status(404).json({ message: "موضوع غير موجود" });
      }
      
      res.json(topic);
    } catch (error) {
      console.error("Update topic error:", error);
      res.status(500).json({ message: "فشل تحديث الموضوع" });
    }
  });

  app.delete("/api/admin/topics/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteApprovedTopic(id);
      res.json({ message: "تم حذف الموضوع" });
    } catch (error) {
      console.error("Delete topic error:", error);
      res.status(500).json({ message: "فشل حذف الموضوع" });
    }
  });

  app.get("/api/admin/posters", requireAdmin, async (req, res) => {
    try {
      const posters = await storage.getAllPosters();
      res.json(posters);
    } catch (error) {
      console.error("Get all posters error:", error);
      res.status(500).json({ message: "فشل جلب البوسترات" });
    }
  });

  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const analytics = await storage.getDetailedAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({ message: "فشل جلب التحليلات" });
    }
  });

  registerImageRoutes(app);

  // Server-side poster export using Puppeteer for proper Arabic RTL rendering
  app.post("/api/export-poster", requireAuth, async (req, res) => {
    try {
      const { html, format, orientation } = req.body;
      
      if (!html || !format) {
        return res.status(400).json({ message: "HTML and format are required" });
      }

      const chromiumPath = process.env.CHROMIUM_PATH || '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: chromiumPath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--font-render-hinting=none',
          '--single-process'
        ]
      });

      const page = await browser.newPage();
      
      // A4 dimensions in pixels at 96 DPI
      const width = orientation === 'landscape' ? 1122 : 794;
      const height = orientation === 'landscape' ? 794 : 1122;
      
      await page.setViewport({ width, height, deviceScaleFactor: 2 });

      // Add Arabic font support and RTL direction
      const fullHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              direction: rtl;
              font-family: 'Cairo', 'Tajawal', sans-serif;
              width: ${width}px;
              height: ${height}px;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;

      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      
      // Wait for fonts to load
      await page.evaluate(() => document.fonts.ready);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (format === 'pdf') {
        const pdfBuffer = await page.pdf({
          format: 'A4',
          landscape: orientation === 'landscape',
          printBackground: true,
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
        
        await browser.close();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=poster.pdf');
        res.send(pdfBuffer);
      } else {
        const pngBuffer = await page.screenshot({
          type: 'png',
          fullPage: true
        });
        
        await browser.close();
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=poster.png');
        res.send(pngBuffer);
      }
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ message: "فشل تصدير البوستر" });
    }
  });

  return httpServer;
}
