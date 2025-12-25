import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.posters.generate.path, async (req, res) => {
    try {
      const { topic, centerName, orientation } = api.posters.generate.input.parse(req.body);

      const prompt = `
        Create a health awareness poster content about: "${topic}".
        Language: Simple Arabic (Iraqi context if applicable, but standard simple Arabic).
        Format: JSON with "title" and "points" (array of 3-5 short sentences).
        The tone should be educational, encouraging, and clear.
        Do not include markdown formatting, just raw JSON.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a health awareness expert. Output valid JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const content = JSON.parse(response.choices[0].message.content || "{}");
      
      // Save to history (optional, but good for record)
      await storage.createPoster({
        topic,
        centerName,
        orientation,
        content,
      });

      res.json(content);
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ message: "Failed to generate poster content" });
    }
  });

  app.get(api.posters.list.path, async (req, res) => {
    const items = await storage.getPosters();
    res.json(items);
  });

  return httpServer;
}
