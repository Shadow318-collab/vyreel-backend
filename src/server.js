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
  const niche = (req.query.niche || "general").toLowerCase();

  const trendMap = {
    motivation: [
      { topic: "Discipline beats motivation", viralScore: 96 },
      { topic: "Morning routines of winners", viralScore: 93 },
      { topic: "Dopamine detox challenge", viralScore: 91 }
    ],
    finance: [
      { topic: "AI side hustles", viralScore: 95 },
      { topic: "How to make your first $1k online", viralScore: 92 },
      { topic: "Passive income systems", viralScore: 90 }
    ],
    business: [
      { topic: "Scaling with AI automation", viralScore: 94 },
      { topic: "Client acquisition systems", viralScore: 91 },
      { topic: "High-ticket offer creation", viralScore: 89 }
    ],
    general: [
      { topic: "Trending viral content", viralScore: 88 }
    ]
  };

  res.json({
    niche,
    trends: trendMap[niche] || trendMap.general
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, function () {
  console.log("VYREEL API running on port " + PORT);
});
