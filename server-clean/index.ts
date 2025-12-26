import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Server is working ✅");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
