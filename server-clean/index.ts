import express from "express";
import { generatePoster } from "./services/posterService";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// فحص السيرفر
app.get("/", (_req, res) => {
  res.send("Health Poster Generator API is running ✅");
});

// API توليد بوستر
app.post("/api/poster", (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({
      error: "Topic is required"
    });
  }

  const poster = generatePoster(topic);
  res.json(poster);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
