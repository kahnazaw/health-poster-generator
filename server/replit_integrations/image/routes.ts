import type { Express, Request, Response } from "express";
import { openai } from "./client";

export function registerImageRoutes(app: Express): void {
  app.post("/api/generate-image", async (req: Request, res: Response) => {
    try {
      const { prompt, size = "1024x1024" } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: size as "1024x1024" | "512x512" | "256x256",
      });

      const imageData = response.data?.[0];
      if (!imageData) {
        return res.status(500).json({ error: "No image data returned" });
      }
      
      // If we have b64_json, use it directly. Otherwise fetch URL and convert
      if (imageData.b64_json) {
        res.json({
          url: imageData.url,
          b64_json: imageData.b64_json,
        });
      } else if (imageData.url) {
        // Fetch the image and convert to base64
        try {
          const imageResponse = await fetch(imageData.url);
          const arrayBuffer = await imageResponse.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          res.json({
            url: imageData.url,
            b64_json: base64,
          });
        } catch (fetchError) {
          console.error("Error fetching image URL:", fetchError);
          res.json({
            url: imageData.url,
            b64_json: null,
          });
        }
      } else {
        res.status(500).json({ error: "No image data available" });
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      res.status(500).json({ 
        error: "Failed to generate image",
        message: error.message || "Unknown error"
      });
    }
  });
}

