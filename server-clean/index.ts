import express from "express";

const app = express();

/**
 * 🚨 هذا هو السطر الحاسم
 * Railway يمرر PORT تلقائيًا
 */
const PORT = Number(process.env.PORT);

if (!PORT) {
  throw new Error("PORT environment variable is missing");
}

app.get("/", (_req, res) => {
  res.send("Server is running ✅");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * 🚨 مهم جدًا: 0.0.0.0
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
