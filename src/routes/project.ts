import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { requireAuth } from "../lib/auth.js";
const router = Router();

router.post("/projects/save", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { title, script, clips, storyboard, music } = req.body;
  if (!title || !script) { res.status(400).json({ error: "Missing title or script" }); return; }
  try {
    const { data, error } = await supabase.from("projects").insert({ user_id: user.userId, title, script, clips: clips??[], storyboard: storyboard??[], music: music??null, created_at: new Date().toISOString() }).select().single();
    if (error) { res.status(500).json({ error: error.message }); return; }
    res.status(201).json({ project: data });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get("/projects", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { data, error } = await supabase.from("projects").select("*").eq("user_id", user.userId).order("created_at", { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ projects: data });
});

router.get("/projects/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { data, error } = await supabase.from("projects").select("*").eq("id", req.params.id).single();
  if (error || !data) { res.status(404).json({ error: "Not found" }); return; }
  if (data.user_id !== user.userId) { res.status(403).json({ error: "Forbidden" }); return; }
  res.json({ project: data });
});

router.delete("/projects/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { data } = await supabase.from("projects").select("user_id").eq("id", req.params.id).single();
  if (!data || data.user_id !== user.userId) { res.status(403).json({ error: "Forbidden" }); return; }
  await supabase.from("projects").delete().eq("id", req.params.id);
  res.json({ message: "Deleted" });
});
export default router;
