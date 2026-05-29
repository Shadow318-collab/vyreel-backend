import { Router } from "express";
const router = Router();
const PIXABAY = process.env.PIXABAY_API_KEY;

router.get("/music", async (req, res) => {
  const { query = "", mood = "" } = req.query as any;
  const q = [query, mood].filter(Boolean).join(" ");
  try {
    const r = await fetch(`https://pixabay.com/api/music/?key=${PIXABAY}&q=${encodeURIComponent(q)}&per_page=15`);
    const d = await r.json() as any;
    res.json({ results: d.hits, total: d.totalHits });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
export default router;
