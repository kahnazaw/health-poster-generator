import express from "express";

const app = express();

/**
 * Railway يعطي PORT إجباريًا
 * لا نضع أي رقم افتراضي
 */
const port = process.env.PORT;

if (!port) {
  console.error("❌ PORT is not defined");
  process.exit(1);
}

app.get("/", (_req, res) => {
  res.send("Health Poster Generator API is running ✅");
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
