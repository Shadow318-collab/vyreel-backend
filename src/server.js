const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Vyreel backend is live");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online"
  });
});

app.get("/api/trends", (req, res) => {
  res.json({
    niche: "content creation",
    trends: [
      {
        topic: "AI side hustles",
        viralScore: 94
      },
      {
        topic: "Faceless YouTube automation",
        viralScore: 91
      },
      {
        topic: "How creators use AI for passive income",
        viralScore: 89
      }
    ]
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, function () {
  console.log("VYREEL API running on port " + PORT);
});
