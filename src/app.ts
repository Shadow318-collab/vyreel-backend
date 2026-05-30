import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (_req, res) => {
  res.send("Vyreel backend is live");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
