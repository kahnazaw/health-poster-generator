import express from "express";

const app = express();

// 🚨 هذا السطر هو الأهم
const PORT = Number(process.env.PORT) || 8080;

app.get("/", (_req, res) => {
  res.send("Server is running ✅");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
