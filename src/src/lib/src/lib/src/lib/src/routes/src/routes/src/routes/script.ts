import { Router } from "express";
const router = Router();
const GEMINI_KEY = process.env.ANTHROPIC_API_KEY;

router.post("/script", async (req, res) => {
  const { topic, niche, tone, platform, duration } = req.body;
  if (!topic) { res.status(400).json({ error: "Missing topic" }); return; }
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Write a ${duration}-min viral video script for: "${topic}"\nPlatform: ${platform} | Niche: ${niche} | Tone: ${tone}\n\nUse sections: 🎬 HOOK, 📖 SETUP, 🔥 ACT 1, 🔥 ACT 2, 🔥 ACT 3, 💡 KEY INSIGHT, 📣 CTA\nInclude [VISUAL CUE] notes.` }] }], generationConfig: { maxOutputTokens: 2048, temperature: 0.7 } })
    });
    const d = await r.json() as any;
    const script = d?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!script) { res.status(500).json({ error: "Empty response from Gemini" }); return; }
    res.json({ script });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
export default router;
