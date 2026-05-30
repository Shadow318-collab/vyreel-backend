import { Router } from "express";
const router = Router();
const PEXELS = process.env.PEXELS_API_KEY;
const PIXABAY = process.env.PIXABAY_API_KEY;

router.get("/broll", async (req, res) => {
  const { query = "", type = "videos", source = "pexels", perPage = "9" } = req.query as any;
  if (!query) { res.status(400).json({ error: "Missing query" }); return; }
  const per = Math.min(parseInt(perPage) || 9, 20);
  try {
    if (source === "pexels") {
      const url = type === "videos"
        ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${per}&orientation=landscape`
        : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per}&orientation=landscape`;
      const r = await fetch(url, { headers: { Authorization: PEXELS! } });
      const d = await r.json() as any;
      const results = type === "videos"
        ? (d.videos||[]).map((v: any) => ({ id:"pex-"+v.id, type:"video", thumb:v.image, src:(v.video_files?.[0])?.link||"", duration:v.duration, photographer:v.user?.name||"", source:"Pexels" }))
        : (d.photos||[]).map((p: any) => ({ id:"pex-"+p.id, type:"photo", thumb:p.src?.medium||"", src:p.src?.large||"", photographer:p.photographer||"", source:"Pexels" }));
      res.json({ results });
    } else {
      const url = type === "videos"
        ? `https://pixabay.com/api/videos/?key=${PIXABAY}&q=${encodeURIComponent(query)}&per_page=${per}`
        : `https://pixabay.com/api/?key=${PIXABAY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${per}`;
      const r = await fetch(url);
      const d = await r.json() as any;
      const results = type === "videos"
        ? (d.hits||[]).map((v: any) => ({ id:"pix-"+v.id, type:"video", thumb:v.videos?.tiny?.thumbnail||"", src:v.videos?.small?.url||"", duration:v.duration, photographer:v.user||"", source:"Pixabay" }))
        : (d.hits||[]).map((p: any) => ({ id:"pix-"+p.id, type:"photo", thumb:p.webformatURL||"", src:p.largeImageURL||"", photographer:p.user||"", source:"Pixabay" }));
      res.json({ results });
    }
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
export default router;
