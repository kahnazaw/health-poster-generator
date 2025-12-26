import express from "express";

const app = express();

// Route رئيسي حتى لا يظهر Application failed to respond
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Route اختبار API
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Railway يحدد PORT تلقائياً
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
