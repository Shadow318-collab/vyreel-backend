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
      {
        topic: "Discipline beats motivation",
        viralScore: 96,
        hook: "Nobody tells you discipline is more important than motivation"
      },
      {
        topic: "Morning routines of winners",
        viralScore: 93,
        hook: "I copied millionaire morning habits for 7 days"
      }
    ],
    finance: [
      {
        topic: "AI side hustles",
        viralScore: 95,
        hook: "3 AI side hustles that can make your first $1k"
      },
      {
        topic: "Passive income systems",
        viralScore: 91,
        hook: "How beginners build passive income in 2026"
      }
    ],
    business: [
      {
        topic: "Client acquisition systems",
        viralScore: 94,
        hook: "How smart founders get clients without chasing"
      },
      {
        topic: "Scaling with AI automation",
        viralScore: 92,
        hook: "AI systems replacing entire business teams"
      }
    ],
    general: [
      {
        topic: "Viral content ideas",
        viralScore: 85,
        hook: "The content strategy creators are using right now"
      }
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
